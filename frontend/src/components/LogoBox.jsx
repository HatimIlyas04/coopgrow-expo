export default function LogoBox({ src, alt = "logo", size = 180 }) {
  return (
    <div
      className="group relative rounded-[26px] bg-white border border-black/5 shadow-sm overflow-hidden 
                 flex items-center justify-center transition hover:-translate-y-[2px] hover:shadow-lg"
      style={{ width: size, height: 110 }}
    >
      {/* subtle shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>

      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-w-[78%] max-h-[62%] object-contain"
        />
      ) : (
        <div className="text-xs font-black text-gray-400">LOGO</div>
      )}
    </div>
  );
}
