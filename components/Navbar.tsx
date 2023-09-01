import Link from "next/link"
import { getSession } from '@auth0/nextjs-auth0';

export default async function Navbar() {
    const session = await getSession();
    const user = session?.user;

    return (
        <nav className="bg-cyan-700 p-4 flex flex-row justify-between items-center pl-8 pr-8 shadow-xl fixed top-0 left-0 w-full z-10">
                <Link href="/about" className="font-bold text-cyan-300 hover:text-blue-400 hover:underline transition">O srakunie</Link>
                <Link href="/" className="text-3xl font-bold text-cyan-300 hover:text-blue-400 hover:underline transition">Srakunpl</Link>
            
            { user === undefined ?
                <a href="api/auth/login" className="font-bold text-cyan-300 hover:text-blue-400 hover:underline transition"><button>Zaloguj</button></a>
            :
                <div className="flex flex-row items-center gap-4">
                    <p className="text-cyan-300">{user.name}</p>
                    <img src={user.picture ?? ""} alt="picture" className="w-10 rounded-full" />
                    <a href="/api/auth/logout" className="p-2 rounded-xl bg-cyan-800 pl-4 pr-4 shadow-xl text-cyan-300 
                    hover:bg-cyan-900 transition">Wyloguj</a>
                </div>
            }            
            
        </nav>
    )
}
