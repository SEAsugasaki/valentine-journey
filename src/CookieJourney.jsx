import { useState, useEffect, useRef } from "react";
import { storyText } from "../data/storyText"; // storyText.js を読み込む

const allCookies = ["プレーン", "抹茶", "紅茶", "レモン", "メレンゲ"];

const questions = [
  "まず最初に、何を食べる？",
  "次に何を食べる？",
  "その次は？",
  "もうひとつ選ぶとしたら？",
  "最後に、何を食べる？",
];

const journeyData = {
  プレーン: { place: "雪と小麦の国", background: "/bg-wheat.jpg" },
  抹茶: { place: "寺院の庭", background: "/bg-tea.jpg" },
  紅茶: { place: "霧の港町", background: "/bg-port.jpg" },
  レモン: { place: "日差しの丘", background: "/bg-lemon.jpg" },
  メレンゲ: { place: "夜明け前の空", background: "/bg-dawn.jpg" },
};

const keyMap = {
  プレーン: "snow_wheat",
  抹茶: "temple_garden",
  紅茶: "fog_harbor",
  レモン: "sunny_hill",
  メレンゲ: "dawn_sky",
};

export default function CookieJourney() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [resultIndex, setResultIndex] = useState(-1);
  const [fade, setFade] = useState(true);

  const audioRef = useRef(null);

  // 選択完了後に順番に表示
  useEffect(() => {
    if (step !== questions.length) return;
    if (resultIndex >= choices.length - 1) return;

    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setResultIndex((prev) => prev + 1);
        setFade(true);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [step, resultIndex, choices]);

  // 音楽自動再生
  useEffect(() => {
    audioRef.current?.play();
  }, []);

    const remainingCookies = allCookies.filter(c => !choices.includes(c));

  if (step < questions.length) {
    return (
      <div style={{ ...styles.container, marginLeft: "220px" }}>
        <audio ref={audioRef} src="/bg-sound.mp3" loop />
        <p>{questions[step]}</p>
        {remainingCookies.map(cookie => (
          <button
            key={cookie}
            style={styles.choiceButton}
            onClick={() => {
              setChoices([...choices, cookie]);
              setStep(step + 1);
              if (step + 1 === questions.length) setResultIndex(0);
            }}
          >
            {cookie}
          </button>
        ))}
        {step === questions.length - 1 && (
          <p style={styles.note}>※これが最後のひとつ</p>
        )}
      </div>
    );
  }

  const currentCookie = choices[resultIndex];
  const data = journeyData[currentCookie];
  const storyKey = keyMap[currentCookie];
  const text = storyText[storyKey][resultIndex + 1];

  return (
    <div
      style={{
        ...styles.fullScreenBackground,
        backgroundImage: `url(${data.background})`,
        marginLeft: "220px"
      }}
    >
      <audio ref={audioRef} src="/bg-sound.mp3" loop />
      <div style={{ ...styles.fade, opacity: fade, transition: "opacity 0.5s" }}>
        <h2>{data.place}</h2>
        <p>{text}</p>
      </div>

      {resultIndex === choices.length - 1 && (
        <>
          <p style={styles.endText}>缶を開けたあなただけの旅。</p>
          <button
            style={styles.choiceButton}
            onClick={() => {
              setStep(0);
              setChoices([]);
              setResultIndex(-1);
              setFade(true);
            }}
          >
            もう一度選ぶ
          </button>
        </>
      )}
    </div>
  );
}
const styles = {
  container: {
    padding: "20px",
    fontSize: "16px",
  },
  fullScreenBackground: {
    width: "calc(100vw - 220px)",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  fade: {
    background: "rgba(0,0,0,0.35)",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "90vw",
    textAlign: "center",
  },
  choiceButton: {
    padding: "10px 16px",
    fontSize: "16px",
    margin: "4px",
    cursor: "pointer",
  },
  note: { fontSize: "14px", opacity: 0.7 },
  endText: { marginTop: "20px", fontSize: "14px", opacity: 0.8 },
};
