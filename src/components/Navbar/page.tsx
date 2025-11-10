import { Button } from "../ui/button"

export const Navbar =()=>{
    return(
    <>
     <div className="fixed z-100 top-0 left-0 bg-black pl-42 w-screen h-20 p-8 flex items-center gap-72">
        <div className="flex gap-2 items-center">
            <img src="/2.png" alt="" />
            <h1 className="text-white text-md font-sans">EchoSpace</h1>
        </div>
        <div className="flex gap-8 justify-center  border bg-black shadow-xs w-96 h-8  items-center rounded-md font-light">
            <h1 className="">Home</h1>
            <h1 className="text-[#ADADAD]">Sessions</h1>
            <h1 className="text-[#ADADAD]">Feedback</h1>
            <h1 className="text-[#ADADAD]">Ideas</h1>
        </div>
        <div className="flex gap-4">
            <Button variant={"outline"}>Log in</Button>
            <Button className="bg-white">Sign up</Button>
        </div>
     </div>
    </>    
    )
}
