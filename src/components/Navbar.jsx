import React from "react";

const Navbar = () => {
    return (
        <div className="bg-[#2b2b2b] text-white w-full">
            <div className="navbar container mx-auto px-6 flex justify-between">
                <div className="flex items-center space-x-6">
                    <a className="text-xl font-bold">AI Zone</a>
                    <ul className="hidden lg:flex menu menu-horizontal space-x-4 ">
                        <li className="text-white"><a>HOME</a></li>
                        <li><a>JOIN</a></li>
                        <li><a>NEWS</a></li>
                        <li><a>JOBS</a></li>
                        <li><a>CONTACT</a></li>
                    </ul>
                </div>
                <div>
                    <button className="btn btn-primary rounded-lg">Stay Ahead - Free</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
