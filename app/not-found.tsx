import Image from 'next/image'

export default function NotFound() {
    return (
        <>
            <h1 className='text-center'>404</h1>
            <Image src={"/talar.png"} width={500} height={500} alt='talar' className='m-auto'/>
        </>
    )
}
