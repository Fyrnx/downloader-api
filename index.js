let fs = require('fs')
let path = require('path')
let http = require('http')
let https = require('https')

let url = 'https://st.depositphotos.com/1005676/2513/i/950/depositphotos_25134583-free-stock-photo-computer-background-http-web-page.jpg'

async function GetImage(url) {
    return await new Promise((resolve,reject) =>  {
        let protocol = http
        if(/https.*/ig.test(url)) {protocol = https}
        protocol.get(url,res => {
            let raw = []
            res.on('data',chunk => {
                raw.push(chunk)
            })s
            res.on('end',_ => {
                if(raw.length > 0) {
                    raw = Buffer.concat(raw)
                    resolve(raw)
                } else { 
                    reject()
                }
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
        .catch(err => { 
            res.write('url isn\'t write')
            res.end()
        })
    }
})

server.listen(1000)
console.log(`listing to port 1000 ...`);
