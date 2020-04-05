const Meme = artifacts.require("meme");
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Meme',(accounts)=>{
    let meme 
    describe('deployment',async()=>{
        it('deployes successfully',async()=>{
            meme = await Meme.deployed()
        const addr = meme.address
        console.log(addr)
        })
        
    })
})