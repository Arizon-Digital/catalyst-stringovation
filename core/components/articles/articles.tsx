function Articles() {
    return (
      <div className="mx-auto max-w-screen-xl py-8">
        <h1 className="text-center text-4xl font-bold mb-8">Featured Articles</h1>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Column 1 */}
          <div className="flex-1 max-w-xs p-4">
            <img
              src="https://placehold.co/600x400"
              alt="Article 1"
              className="w-full h-auto mb-4"
            />
            <h3 className="text-lg font-bold mb-2">Article 1</h3>
            <p className="text-sm text-gray-600">
              A short description of the first article goes here.
            </p>
          </div>
  
          {/* Column 2 */}
          <div className="flex-1 max-w-xs p-4">
            <img
              src="https://placehold.co/600x400"
              alt="Article 2"
              className="w-full h-auto mb-4"
            />
            <h3 className="text-lg font-bold mb-2">Article 2</h3>
            <p className="text-sm text-gray-600">
              A short description of the second article goes here.
            </p>
          </div>
  
          {/* Column 3 */}
          <div className="flex-1 max-w-xs p-4">
            <img
              src="https://placehold.co/600x400"
              alt="Article 3"
              className="w-full h-auto mb-4"
            />
            <h3 className="text-lg font-bold mb-2">Article 3</h3>
            <p className="text-sm text-gray-600">
              A short description of the third article goes here.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  Articles.displayName = 'Articles';
  
  export { Articles };
  