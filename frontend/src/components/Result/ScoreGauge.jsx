import "react-circular-progressbar/dist/styles.css";

import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";

export default function ScoreGauge({ score }) {

    return (

        <div className="w-56">

            <CircularProgressbar

                value={score}

                text={`${score}%`}

                styles={buildStyles({

                    pathColor:
                        score >= 85
                            ? "#22c55e"
                            : score >= 60
                            ? "#f59e0b"
                            : "#ef4444",

                    textColor: "#ffffff",

                    trailColor: "#1e293b"

                })}

            />

        </div>

    );

}