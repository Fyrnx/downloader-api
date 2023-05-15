let http = require('http')
let https = require('https')
let fs = require('fs')
let path = require('path')


async function GetUrl(url) {
    return await new Promise((resolve,reject) =>  {
        let protocol = http
        if(/https.*/ig.test(url)) {protocol = https}
            protocol.get(url,res => {
                let raw = []
                res.on('data',chunk => {
                    raw.push(chunk)
                })
                res.on('end',_ => {
                    raw = Buffer.concat(raw)
                    resolve(raw)
                })
            }).on("error", (err) => {
                reject()
            });
    })
}

async function CheckUrl(url,type,group = false) {

    function RemoveAny(str1,str2) {
        for(let i = 0; i < str1.length; i++) { 
            if(str1[i] == '?') {
                str1 = str1.slice(0,i) + str1.slice(i + 1)
                str2 = str2.slice(0,i) + str2.slice(i + 1)
                i--
            };
        }

        return [str1,str2]
    }


    function checkbuffer(buffer,buffercode) { 
        if(buffer == undefined) {return false}

        if(Array.isArray(buffercode)) { 
            let match = false
            buffercode.forEach(code => {
                let buffer_code = code.toLowerCase().replace(/\s/ig,'')
                let hex = buffer.toString('hex').slice(0,buffer_code.length)

                if(/\?/ig.test(buffer_code)) { 
                    let remove = RemoveAny(buffer_code,hex)
                    buffer_code = remove[0]
                    hex = remove[1]
                }

                if(hex == buffer_code) {
                    match = true
                }
            })

            return match
        } else { 
            let buffer_code = buffercode.toLowerCase().replace(/\s/ig,'')
            let hex = buffer.toString('hex').slice(0,buffer_code.length) == buffer_code

            if(/\?/ig.test(buffer_code)) { 
                let remove = RemoveAny(buffer_code,hex)
                buffer_code = remove[0]
                hex = remove[1]
            }

            return hex == buffer_code
        }
    }

        if(Array.isArray(buffercode)) { 
            let match = false
            buffercode.forEach(code => {
                let buffer_code = code.toLowerCase().replace(/\s/ig,'')
                let hex = buffer.toString('hex').slice(0,buffer_code.length)

                if(/\?/ig.test(buffer_code)) { 
                    let remove = RemoveAny(buffer_code,hex)
                    buffer_code = remove[0]
                    hex = remove[1]
                }

                if(hex == buffer_code) {
                    match = true
                }
            })

            return match
        } else { 
            let buffer_code = buffercode.toLowerCase().replace(/\s/ig,'')
            let hex = buffer.toString('hex').slice(0,buffer_code.length) == buffer_code

            if(/\?/ig.test(buffer_code)) { 
                let remove = RemoveAny(buffer_code,hex)
                buffer_code = remove[0]
                hex = remove[1]
            }

            return hex == buffer_code
        }
    }

    return await new Promise((resolve,reject) =>  {
        if(type == undefined) {reject()}
        let protocol = http
        if(/https.*/ig.test(url)) {protocol = https}
            protocol.get(url,res => {
                let raw = []
                let test_file = fs.readFileSync(`./mime.json`)
                test_file = JSON.parse(test_file.toString())
                res.on('data', data => raw.push(data))
                res.on('end', _ => { 
                    if(group) {
                        let the_group = test_file['groups'][type]
                        let match = false
                        the_group.forEach(ext => { 
                            if(checkbuffer(raw[0],test_file['global'][ext])) { 
                                match = true
                            }
                        })
                        if(match) {resolve()} else {reject()}
                    } else {
                        let buffer_code =  test_file['global'][type]
                        console.log(type,test_file,test_file['global'],test_file['global'][type]);
                        if(buffer_code != undefined) { 
                            if(checkbuffer(raw[0],buffer_code)) { 
                                resolve()
                            }
                        } else { 
                            reject()
                        }
                    }
                })





            }).on("error", (err) => {
                reject()
            });
    })
}

let server = http.createServer((req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(req.url == '/') { 
        res.write('please inter image url with (read / check) ')
        res.end()
    } else if(/\/read/.test(req.url)) { 
        let url = new URL(`http://${req.url}`)
        let q = url.searchParams.get('q')

        GetUrl(q).then(data => {
            res.write(data)
            res.end()
        }, err => {
            res.write('url didn\'t send data')
            res.end()
        })

    } else if(/\/check/.test(req.url)) { 
        let url = new URL(`http://${req.url}`)
        let q = url.searchParams.get('q')
        let ext = url.searchParams.get('ext')
        let group = url.searchParams.get('group') || false

        CheckUrl(q,ext,group).then(_ => { 
            res.write('true')
            res.end()
        },_ => { 
            res.write('false')
            res.end()
        })
    } else { 
        res.write(`there is not ${req.url.slice(1)} please use (read / check)`)
        res.end()
    }
})

server.listen(process.env.PORT || 2600,_ => {
    console.log(`runing on port ${process.env.PORT || 2600}`)
})
