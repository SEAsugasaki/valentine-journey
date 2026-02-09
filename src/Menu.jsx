import { Link } from "react-router-dom";

function Menu() {
  return (
    <div style={styles.menu}>
      <h3>メニュー</h3>
      <ul style={styles.menuList}>
        <li><Link to="/" style={styles.menuLink}>Cookie Journey</Link></li>
        <li><Link to="/creator" style={styles.menuLink}>製作者より</Link></li>
        <li><Link to="/ingredients" style={styles.menuLink}>原材料</Link></li>
      </ul>
    </div>
  );
}

const styles = {
  menu: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "200px",
    height: "100vh",
    backgroundColor: "#222",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
  },
  menuList: { listStyle: "none", padding: 0, marginTop: "20px" },
  menuLink: { color: "white", textDecoration: "none", display: "block", margin: "10px 0" },
};
