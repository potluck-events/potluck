import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

// page not found
export function Error404 () {
    return (
        <>
        <Typography variant='h2' className='py-10 text-center'>SORRY</Typography>
        <div className="">
            <div style={{ width: '100%', height: 0, paddingBottom: '75%', paddingTop: '', position: 'relative' }}>
                <iframe src="https://giphy.com/embed/iGpkO05xWTl17Vhq6Y" width="100%" height="100%" style={{ position: 'absolute' }} allowFullScreen></iframe>
                <p><a href="https://giphy.com/gifs/will-smith-fresh-prince-empty-room-iGpkO05xWTl17Vhq6Y"></a></p>
            </div>
        </div>
        <Typography variant='h2' className='py-10 text-center'>PAGE NOT FOUND</Typography>
        </>
    )
}

// permissions error (ask host to invite maybe?)
 export function Error403 () {
    return (
        <>
        <Typography variant='h2' className='py-10 text-center'>SORRY</Typography>
        <div className="">
            <div style={{ width: '100%', height: 0, paddingBottom: '75%', position: 'relative' }}>
                <iframe src="https://giphy.com/embed/B1oMSRJiTq63e" width="100%" height="100%" style={{ position: 'absolute' }} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                <p><a href="https://giphy.com/gifs/reaction-fresh-prince-of-bel-air-B1oMSRJiTq63e">via GIPHY</a></p>
            </div>
        </div>
        <Typography variant='h2' className='py-10 text-center'>YOU ARE NOT PERMITTED</Typography>
        </>
    )
}