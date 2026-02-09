// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { storyText } from "./data/storyText";

// -------------------- HamburgerMenu --------------------
function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // ページ遷移したら自動で閉じる
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.getElementById("slideMenu");
      const button = document.getElementById("hamburgerButton");
      if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("click", handleClickOutside);
    else document.removeEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const menuStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 220,
    height: "100vh",
    backgroundColor: "#222",
    color: "white",
    padding: 20,
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
    zIndex: 99,
  };

  const buttonStyle = {
    position: "fixed",
    top: 20,
    left: 20,
    zIndex: 100,
    width: 40,
    height: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const lineStyle = {
    height: 4,
    background: "rgba(255,255,255,0.7)",
    borderRadius: 2,
  };

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        id="hamburgerButton"
        onClick={() => setOpen(!open)}
        style={buttonStyle}
      >
        <span style={lineStyle}></span>
        <span style={lineStyle}></span>
        <span style={lineStyle}></span>
      </button>

      {/* スライドメニュー */}
      <div id="slideMenu" style={menuStyle}>
        <h3>メニュー</h3>
        <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
          <li>
            <Link to="/" style={styles.menuLink}>Cookie Journey</Link>
          </li>
          <li>
            <Link to="/creator" style={styles.menuLink}>製作者より</Link>
          </li>
          <li>
            <Link to="/ingredients" style={styles.menuLink}>原材料</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

// -------------------- Cookie Journey --------------------
function CookieJourney() {
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

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [resultIndex, setResultIndex] = useState(-1);
  const [fade, setFade] = useState(true);
  const audioRef = useRef(null);

  // 選択後の順番表示
  useEffect(() => {
    if (!started) return;
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
  }, [step, resultIndex, choices, started]);

  // 音楽自動再生
  useEffect(() => {
    audioRef.current?.play();
  }, [started]);

  const remainingCookies = allCookies.filter((c) => !choices.includes(c));

  // --- まだ始めていない画面 ---
  if (!started) {
    return (
      <div
        style={{
          ...styles.fullScreenBackground,
          backgroundImage: "url(/bg-start.jpg)",
        }}
      >
        <audio ref={audioRef} src="/bg-sound.mp3" loop autoPlay />
        <p>旅に出ている友人から、</p>
        <p>小さな箱が届いた。</p>
        <button style={styles.choiceButton} onClick={() => setStarted(true)}>
          はじめる
        </button>
      </div>
    );
  }

  // --- 選択中（5回の質問画面） ---
  if (step < questions.length) {
    return (
      <div
        style={{
          ...styles.fullScreenBackground,
          backgroundImage: "url(/bg-start.jpg)",
        }}
      >
        <audio ref={audioRef} src="/bg-sound.mp3" loop autoPlay />
        <p>{questions[step]}</p>
        {remainingCookies.map((cookie) => (
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

  // --- 結果表示 ---
  const currentCookie = choices[resultIndex];
  const data = journeyData[currentCookie];
  const storyKey = keyMap[currentCookie];
  const text = storyText[storyKey][resultIndex + 1];

  return (
    <div
      style={{
        ...styles.fullScreenBackground,
        backgroundImage: `url(${data.background})`,
      }}
    >
      <audio ref={audioRef} src="/bg-sound.mp3" loop autoPlay />
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

// -------------------- 製作者よりページ --------------------
function Creator() {
  return (
    <div style={{ padding: 20 }}>
      <h2>製作者より</h2>
      <p>
        バレンタインデーにこうしたクッキー缶を作るようになって3年目です。<br />
        今年はラストイヤーということでこんなウェブサイトを作ってみました笑<br />
        バレンタインというより、存分に創作できる格好の機会として、お菓子をつくてます。<br />
        2年前は琥珀糖、1年前はすみれの砂糖漬け、今年はメレンゲクッキーを作りました。<br />
        今年もファンタジーな世界観を楽しんでいただけたら嬉しいです。<br />
        もらってくれてありがとうございました。
      </p>
    </div>
  );
}

// -------------------- 原材料ページ --------------------
function Ingredients() {
  return (
    <div style={{ padding: 20 }}>
      <h2>原材料</h2>

      <h3>○プレーンクッキー</h3>
      <ul>
        <li>薄力粉</li>
        <li>バター</li>
        <li>粉糖（コーンスターチ入り）</li>
        <li>卵黄</li>
        <li>バニラエッセンス</li>
        <li>アーモンドパウダー</li>
      </ul>

      <h3>○抹茶クッキー</h3>
      <ul>
        <li>薄力粉</li>
        <li>バター</li>
        <li>粉糖（コーンスターチ入り）</li>
        <li>抹茶パウダー</li>
      </ul>

      <h3>○紅茶クッキー</h3>
      <ul>
        <li>薄力粉</li>
        <li>バター</li>
        <li>粉糖（コーンスターチ入り）</li>
        <li>紅茶</li>
        <li>牛乳</li>
        <li>グラニュー糖</li>
      </ul>

      <h3>○レモンクッキー</h3>
      <ul>
        <li>薄力粉</li>
        <li>バター</li>
        <li>粉糖（コーンスターチ入り）</li>
        <li>レモン</li>
        <li>生クリーム</li>
        <li>グラニュー糖</li>
      </ul>

      <h3>○メレンゲクッキー</h3>
      <ul>
        <li>卵白</li>
        <li>グラニュー糖</li>
        <li>バニラエッセンス</li>
      </ul>
    </div>
  );
}

// -------------------- App --------------------
export default function App() {
  return (
    <Router>
      <HamburgerMenu />
      <Routes>
        <Route path="/" element={<CookieJourney />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/ingredients" element={<Ingredients />} />
      </Routes>
    </Router>
  );
}

// -------------------- スタイル --------------------
const styles = {
  container: { padding: 20, fontSize: 16 },
  fullScreenBackground: {
    width: "100vw",
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
    padding: 20,
    borderRadius: 8,
    maxWidth: "90vw",
    textAlign: "center",
  },
  choiceButton: { padding: "10px 16px", fontSize: 16, margin: 4, cursor: "pointer" },
  note: { fontSize: 14, opacity: 0.7 },
  endText: { marginTop: 20, fontSize: 14, opacity: 0.8 },
  menuLink: { color: "white", textDecoration: "none", display: "block", margin: "10px 0" },
};
