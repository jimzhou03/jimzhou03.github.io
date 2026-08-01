export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-signature">
        <b>WEIJIE ZHOU</b>
      </div>
      <blockquote className="footer-motto">
        <span lang="zh-CN">前途是光明的，道路是曲折的。——毛泽东</span>
        <cite>THE FUTURE IS BRIGHT. THE ROAD IS WINDING. · MAO ZEDONG</cite>
      </blockquote>
      <nav className="footer-links" aria-label="Contact links">
        <a href="mailto:weijiezhou03@outlook.com">EMAIL</a>
        <a
          href="https://www.linkedin.com/in/%E7%BB%B4%E6%9D%B0-%E5%91%A8-779817409/"
          target="_blank"
          rel="noreferrer"
        >
          LINKEDIN ↗
        </a>
        <a href="https://github.com/jimzhou03" target="_blank" rel="noreferrer">
          GITHUB ↗
        </a>
      </nav>
    </footer>
  );
}
