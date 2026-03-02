import { ui, defaultLang } from "@/i18n/ui"

interface LogoProps {
    mainText?: string;
    tagline?: string;
    logoScale?: number;
    textScale?: number;
    lang?: string;
}

export function Logo({
    mainText = "STORE'N U",
    tagline,
    logoScale = 0.3,
    textScale = 0.3,
    lang = defaultLang
}: LogoProps) {
    const activeLang = (lang in ui ? lang : defaultLang) as keyof typeof ui;
    const activeTagline = tagline || ui[activeLang]['logo.tagline'] || ui[defaultLang]['logo.tagline'];
    return (
        <a href={activeLang === defaultLang ? "/" : `/${activeLang}`} className="cursor-pointer">
            <div className="flex items-center justify-center" style={{
                padding: `${120 * logoScale}px ${80 * logoScale}px`
            }}>
                <div
                    className="relative bg-yellow-400"
                    style={{
                        padding: `${60 * logoScale}px ${80 * logoScale}px`,
                    }}
                >
                    {/* Distressed border frame */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 800 500"
                        preserveAspectRatio="none"
                        style={{ transform: 'skewX(-2deg)' }}
                    >
                        {/* Outer frame */}
                        {/* Top larger box with incomplete bottom-right */}
                        <path
                            d="M 40 30 L 760 20 L 760 320 L 520 320"
                            fill="none"
                            stroke="black"
                            strokeWidth="16"
                            strokeLinecap="square"
                        />
                        <path
                            d="M 40 30 L 40 320"
                            fill="none"
                            stroke="black"
                            strokeWidth="16"
                            strokeLinecap="square"
                        />
                        {/* Bottom smaller box */}
                        <path
                            d="M 40 320 L 40 470 L 750 470 L 750 320"
                            fill="none"
                            stroke="black"
                            strokeWidth="16"
                            strokeLinecap="square"
                        />
                        {/* Inner frame shadow/thickness */}
                        <path
                            d="M 60 50 L 740 42 L 732 450 L 50 458 Z"
                            fill="none"
                            stroke="black"
                            strokeWidth="12"
                            opacity="0.3"
                        />
                        {/* Distress texture overlay */}
                        <g opacity="0.15">
                            <rect x="35" y="25" width="8" height="6" fill="black" />
                            <rect x="700" y="22" width="12" height="8" fill="black" />
                            <rect x="745" y="450" width="10" height="15" fill="black" />
                            <rect x="32" y="465" width="15" height="12" fill="black" />
                            <circle cx="100" cy="35" r="4" fill="black" />
                            <circle cx="650" cy="30" r="5" fill="black" />
                            <circle cx="720" cy="460" r="6" fill="black" />
                            <circle cx="70" cy="470" r="4" fill="black" />
                        </g>
                    </svg>

                    {/* Content */}
                    <div className="relative z-10" style={{ transform: 'skewX(-2deg)' }}>
                        {/* Main text */}
                        <div
                            className="font-black tracking-tight text-black mb-4"
                            style={{
                                fontSize: `${120 * textScale}px`,
                                lineHeight: '0.9',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            {mainText}
                        </div>

                        {/* Underline */}
                        <div
                            className="bg-black mb-4"
                            style={{
                                height: `${16 * textScale}px`,
                                width: '100%',
                                marginTop: `${-8 * textScale}px`,
                                marginBottom: `${16 * textScale}px`
                            }}
                        />

                        {/* Tagline */}
                        <div
                            className="font-bold text-black"
                            style={{
                                fontSize: `${36 * textScale}px`,
                                lineHeight: '1.2'
                            }}
                        >
                            {activeTagline}
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}