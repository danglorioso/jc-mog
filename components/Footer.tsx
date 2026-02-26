export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-gray-900/80 backdrop-blur-sm">
      <div className="w-full px-6 sm:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-screen-lg mx-auto">
          <p className="text-off-white/90 text-sm order-2 sm:order-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-off-white/90 text-sm text-center order-1 sm:order-2">
            Created by{" "}
            <a
              href="https://danglorioso.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:brightness-110 font-medium transition-colors underline decoration-brand/50 hover:decoration-brand underline-offset-2"
            >
              Dan Glorioso
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
