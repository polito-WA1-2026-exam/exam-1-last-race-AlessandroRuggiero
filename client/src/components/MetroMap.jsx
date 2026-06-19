export function MetroMap({ style, hideLines = false }) {
    const RED = hideLines ? "#999" : "#E7002D";
    const BLUE = hideLines ? "#999" : "#003E7E";
    const VIOLET = hideLines ? "#999" : "#8844BB";
    const YELLOW = hideLines ? "#999" : "#D4A017";
    const DARK = "#1A1A1A";

    return (
        <svg
            viewBox="0 0 820 530"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", width: "100%", height: "auto", ...style }}
            role="img"
            aria-label="Stockholm Metro schematic map"
        >
            <defs>
                <style>{`
                    .lbl  { font: 13px system-ui,'Helvetica Neue',Arial,sans-serif; fill: #444; }
                    .lblb { font: 600 15px system-ui,'Helvetica Neue',Arial,sans-serif; fill: #111; }
                    .stn  { cursor: pointer; }
                    .stn circle { transition: stroke-width 0.12s, r 0.12s; }
                    .stn:hover circle { stroke-width: 4.5px; }
                    .stn .lbl, .stn .lblb { transition: fill 0.12s; }
                    .stn:hover .lbl, .stn:hover .lblb { fill: #000; }
                `}</style>
            </defs>

            {!hideLines && (
                <>
                    {/* Yellow: vertical (Fridhemsplan → Liljeholmen) */}
                    <line x1="200" y1="180" x2="200" y2="380" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
                    {/* Yellow: south turn + horizontal */}
                    <polyline
                        points="200,380 200,480 700,480"
                        stroke={YELLOW}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Violet: horizontal (Alvik → Hötorget) */}
                    <line x1="100" y1="180" x2="400" y2="180" stroke={VIOLET} strokeWidth="5" strokeLinecap="round" />
                    {/* Violet: NW diagonal (Hötorget → T-Centralen) */}
                    <line x1="400" y1="180" x2="500" y2="280" stroke={VIOLET} strokeWidth="5" strokeLinecap="round" />
                    {/* Violet: SE diagonal (T-Centralen → Skanstull → Gullmarsplan) */}
                    <polyline
                        points="500,280 600,380 700,480"
                        stroke={VIOLET}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Red: vertical (Tekniska högskolan → Gamla stan) */}
                    <line x1="500" y1="80" x2="500" y2="380" stroke={RED} strokeWidth="5" strokeLinecap="round" />
                    {/* Red: horizontal (Aspudden → Gamla stan) */}
                    <line x1="100" y1="380" x2="500" y2="380" stroke={RED} strokeWidth="5" strokeLinecap="round" />

                    {/* Blue: Fridhemsplan → Odenplan (45° diagonal) → Sofia */}
                    <polyline
                        points="200,180 300,280 700,280"
                        stroke={BLUE}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}

            {/* T-Centralen — main hub */}
            <g className="stn" id="s-tcentralen">
                <title>T-Centralen</title>
                <circle cx="500" cy="280" r="7" fill="white" stroke={DARK} strokeWidth="2.5" />
                <text x="500" y="265" className="lbl" textAnchor="middle">
                    T-Centralen
                </text>
            </g>

            {/* Interchange stations (r=7, dark ring) */}
            <g className="stn" id="s-fridhemsplan">
                <title>Fridhemsplan</title>
                <circle cx="200" cy="180" r="7" fill="white" stroke={DARK} strokeWidth="2.5" />
                <text x="200" y="165" className="lbl" textAnchor="middle">
                    Fridhemsplan
                </text>
            </g>

            <g className="stn" id="s-liljeholmen">
                <title>Liljeholmen</title>
                <circle cx="200" cy="380" r="7" fill="white" stroke={DARK} strokeWidth="2.5" />
                <text x="200" y="400" className="lbl" textAnchor="middle">
                    Liljeholmen
                </text>
            </g>

            <g className="stn" id="s-gullmarsplan">
                <title>Gullmarsplan</title>
                <circle cx="700" cy="480" r="7" fill="white" stroke={DARK} strokeWidth="2.5" />
                <text x="712" y="477" className="lbl">
                    Gullmarsplan
                </text>
            </g>

            {/* Red line stations */}
            <g className="stn">
                <title>Tekniska högskolan</title>
                <circle cx="500" cy="80" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="512" y="85" className="lbl">
                    Tekniska högskolan
                </text>
            </g>

            <g className="stn">
                <title>Stadion</title>
                <circle cx="500" cy="180" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="512" y="185" className="lbl">
                    Stadion
                </text>
            </g>

            <g className="stn">
                <title>Aspudden</title>
                <circle cx="100" cy="380" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="100" y="400" className="lbl" textAnchor="middle">
                    Aspudden
                </text>
            </g>

            <g className="stn">
                <title>Hornstull</title>
                <circle cx="300" cy="380" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="300" y="365" className="lbl" textAnchor="middle">
                    Hornstull
                </text>
            </g>

            <g className="stn">
                <title>Slussen</title>
                <circle cx="400" cy="380" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="400" y="400" className="lbl" textAnchor="middle">
                    Slussen
                </text>
            </g>

            <g className="stn" id="s-gamlastan">
                <title>Gamla stan</title>
                <circle cx="500" cy="380" r="5" fill="white" stroke={RED} strokeWidth="2.5" />
                <text x="500" y="365" className="lbl" textAnchor="middle">
                    Gamla stan
                </text>
            </g>

            {/* Violet line stations */}
            <g className="stn">
                <title>Alvik</title>
                <circle cx="100" cy="180" r="5" fill="white" stroke={VIOLET} strokeWidth="2.5" />
                <text x="100" y="165" className="lbl" textAnchor="middle">
                    Alvik
                </text>
            </g>

            <g className="stn" id="s-hotorget">
                <title>Hötorget</title>
                <circle cx="400" cy="180" r="5" fill="white" stroke={VIOLET} strokeWidth="2.5" />
                <text x="400" y="165" className="lbl" textAnchor="middle">
                    Hötorget
                </text>
            </g>

            <g className="stn">
                <title>Skanstull</title>
                <circle cx="600" cy="380" r="5" fill="white" stroke={VIOLET} strokeWidth="2.5" />
                <text x="612" y="373" className="lbl">
                    Skanstull
                </text>
            </g>

            {/* Blue line stations */}
            <g className="stn" id="s-odenplan">
                <title>Odenplan</title>
                <circle cx="300" cy="280" r="5" fill="white" stroke={BLUE} strokeWidth="2.5" />
                <text x="300" y="298" className="lbl" textAnchor="middle">
                    Odenplan
                </text>
            </g>

            <g className="stn">
                <title>Rådhuset</title>
                <circle cx="400" cy="280" r="5" fill="white" stroke={BLUE} strokeWidth="2.5" />
                <text x="400" y="265" className="lbl" textAnchor="middle">
                    Rådhuset
                </text>
            </g>

            <g className="stn">
                <title>Kungsträdgården</title>
                <circle cx="600" cy="280" r="5" fill="white" stroke={BLUE} strokeWidth="2.5" />
                <text x="600" y="298" className="lbl" textAnchor="middle">
                    Kungsträdgården
                </text>
            </g>

            <g className="stn">
                <title>Sofia</title>
                <circle cx="700" cy="280" r="5" fill="white" stroke={BLUE} strokeWidth="2.5" />
                <text x="712" y="285" className="lbl">
                    Sofia
                </text>
            </g>

            {/* Yellow line stations */}
            <g className="stn">
                <title>Årstadal</title>
                <circle cx="300" cy="480" r="5" fill="white" stroke={YELLOW} strokeWidth="2.5" />
                <text x="300" y="465" className="lbl" textAnchor="middle">
                    Årstadal
                </text>
            </g>

            <g className="stn">
                <title>Årstafältet</title>
                <circle cx="400" cy="480" r="5" fill="white" stroke={YELLOW} strokeWidth="2.5" />
                <text x="400" y="465" className="lbl" textAnchor="middle">
                    Årstafältet
                </text>
            </g>

            <g className="stn">
                <title>Älvsjö</title>
                <circle cx="500" cy="480" r="5" fill="white" stroke={YELLOW} strokeWidth="2.5" />
                <text x="500" y="465" className="lbl" textAnchor="middle">
                    Älvsjö
                </text>
            </g>

            <g className="stn">
                <title>Hagsätra</title>
                <circle cx="600" cy="480" r="5" fill="white" stroke={YELLOW} strokeWidth="2.5" />
                <text x="600" y="465" className="lbl" textAnchor="middle">
                    Hagsätra
                </text>
            </g>
        </svg>
    );
}
