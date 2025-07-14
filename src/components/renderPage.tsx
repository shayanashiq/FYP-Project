import React, { useEffect, useState } from "react";

const RenderExternalPage = ({ url }: { url: string }) => {
  const [content, setContent] = useState<{
    navbar: string;
    header: string;
    footer: string;
  }>({ navbar: "", header: "", footer: "" });

  useEffect(() => {
    // Fetch content from the external URL via your API
    const fetchContent = async () => {
      try {
        const contentRes = await fetch(
          `/api/merckArticle?url=${encodeURIComponent(url)}`
        );
        const html = await contentRes.text();

        const extractedContent = extractContentByClasses(html);
        setContent(extractedContent);
      } catch (error) {
        throw new Error("Error fetching external content");
      }
    };

    fetchContent();
  }, [url]);

  useEffect(() => {
    // Inject the external CSS files into the document's head
    const cssLinks = [
      "https://www.merckmanuals.com/professional/_next/static/css/a439eacc211d7e49.css",
      "https://www.merckmanuals.com/professional/_next/static/css/ed9f72111540985f.css",
      "https://www.merckmanuals.com/professional/_next/static/css/69678b491375cce8.css",
      "https://www.merckmanuals.com/professional/_next/static/css/daec2e2dc3115a9c.css",
      "https://www.merckmanuals.com/professional/_next/static/css/5743eddd09a16948.css",
      "https://www.merckmanuals.com/professional/_next/static/css/f203402e0919269d.css",
      "https://www.merckmanuals.com/professional/_next/static/css/31894b378344dae7.css",
      "https://www.merckmanuals.com/professional/_next/static/css/e4646ab2738c9281.css",
      "https://www.merckmanuals.com/professional/_next/static/css/50edc494e87c72cd.css",
      "https://www.merckmanuals.com/professional/_next/static/css/858e25c95a6222f8.css",
      "https://www.merckmanuals.com/professional/_next/static/css/58b72b8f4137b60e.css",      
    ];

    cssLinks.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.type = "text/css";
      link.media = "all";
      document.head.appendChild(link);

      // Cleanup by removing the link tags on unmount
      return () => {
        document.head.removeChild(link);
      };
    });
  }, []);

  const updateLinks = (doc: Document) => {
    const links = doc.querySelectorAll("a[href]");

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("/professional/authors")) {
        
        link.removeAttribute("href");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });

        const anchorLink = link as HTMLAnchorElement;
        anchorLink.style.pointerEvents = "none";
        anchorLink.style.color = "#999";
        anchorLink.style.textDecoration = "none";
      } else if (href.startsWith("/professional")) {
        const urlParts = href.split("/");
        if (urlParts.length > 3) {
          const newHref = urlParts.slice(2).join("/");
          link.setAttribute("href", `/doctor/merckandmanuals/professional/${newHref}`);
        }
      }
    });
  };

  const extractContentByClasses = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    updateLinks(doc);

    const navbarElement = doc.querySelector(".Topic_topicContainerRight__1T_vb");
    const headerElement = doc.querySelector(".header");
    const footerElement = doc.querySelector(".footer");

    return {
      navbar: navbarElement ? navbarElement.innerHTML : "",
      header: headerElement ? headerElement.innerHTML : "",
      footer: footerElement ? footerElement.innerHTML : "",
    };
  };

  if (!content.navbar && !content.header && !content.footer) {
    return (
      <div className="min-h-[580px] min-w-[1030px] mt-4">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 rounded-md min-h-[580px] min-w-[1000px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4 mt-4" style={{ width: "", overflowX: "hidden" }}>
      <div className="external-content-container" style={{ margin: "0 auto" }}>
        <div className="navbar" dangerouslySetInnerHTML={{ __html: content.navbar }} />
        <div className="header" dangerouslySetInnerHTML={{ __html: content.header }} />
        {/* <div className="footer" dangerouslySetInnerHTML={{ __html: content.footer }} /> */}
      </div>
    </div>
  );
};

export default RenderExternalPage;
