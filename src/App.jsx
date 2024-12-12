import { IoMdMenu } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { BsFillSignIntersectionFill } from "react-icons/bs";

function App() {
  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="w-full flex justify-between">
        <div>
          <IoMdMenu size={30} />
        </div>
        <div className="flex gap-4">
          <p>
            <MdLogin size={30} />
          </p>
          <p>
            <BsFillSignIntersectionFill size={30} />
          </p>
        </div>
      </div>
      <h1 className="font-bold text-neutral-800 py-4 text-center border-b border-neutral-400">QR Scanner</h1>
    </div>
  );
}

export default App;
