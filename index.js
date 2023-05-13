let http = require('http')
let https = require('https')

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

async function CheckUrl(url) {
    return await new Promise((resolve,reject) =>  {
        let protocol = http
        if(/https.*/ig.test(url)) {protocol = https}
            protocol.get(url,_ => {
                resolve(true)
            }).on("error", (err) => {
                resolve(false)
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

        CheckUrl(q).then(result => { 
            res.write(result)
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
