const ImageKit = require('imagekit')
const {v4:uuid} = require('uuid')

const imagekit = new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLICKEY,
    privateKey:process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage({buffer,filename,folder='/products'}){
    
    const res = await imagekit.upload({
        file:buffer,
        fileName:uuid(),
        folder,
    });

    return {
        url:res.url,
        thumbnail:res.thumbnailUrl || res.url
    }

}