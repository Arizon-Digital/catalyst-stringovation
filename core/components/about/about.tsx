function About() {
    return (
      <div className="mx-auto max-w-screen-xl py-8">        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">          
          <div className="flex flex-col items-center gap-4 w-full md:w-2/5">
            <button className="w-full max-w-[250px] px-6 py-3 bg-[#ec9a20] text-black font-bold rounded hover:bg-opacity-90 focus:outline-none">
              Login
            </button>
            <button className="w-full max-w-[250px] px-6 py-3 bg-[#ec9a20] text-black font-bold rounded hover:bg-opacity-90 focus:outline-none">
              Become a Member
            </button>
            <p className="text-black text-center mt-4">
              To access all, we have to offer
            </p>
          </div>          
          <div className="w-full md:w-3/5 aspect-video">
            <iframe
              src="https://www.youtube.com/embed/YTL6DURA_HA"
              title="BigCommerce Tutorial For Beginners 2024 | Create A Professional ECommerce Website"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
  
  About.displayName = 'About';
  
  export { About };
  