let http = require('http')
let https = require('https')

async function GetImage(url) {
    return await new Promise(resolve =>  {
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
        })
    })
}

let server = http.createServer((req,res) => {
    if(req.url == '/') { 
        res.write('please inter image url')
        res.end()
    } else { 
        let url = req.url.slice(1)
        GetImage(url).then(data => {
            res.write(data)
            res.end()
        })
    }
})

server.listen(process.env.PORT || 6000,_ => {
    console.log(`runing on port ${process.env.PORT || 6000}`)
})
