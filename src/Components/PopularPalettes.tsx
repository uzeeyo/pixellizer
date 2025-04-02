import { useState, useEffect } from "react";

interface Palette {
  id: string;
  title: string;
  colors: string[];
  creator?: string;
  downloads: string;
  likes: number;
  tags: string[];
}

const LospecPaletteList = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = "https://lospec.com/palette-list/load?colorNumberFilterType=any&colorNumber=8&page=1&tag=&sortingType=default"
        const response = await fetch(
          proxyUrl + url,
          {}
        );

        if (!response.ok) {
          console.log(response);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the API response to our component structure
        const formattedPalettes = data.palettes.map((palette: any) => ({
          id: palette._id,
          title: palette.title,
          colors: palette.colors,
          creator: palette.user?.name,
          downloads: palette.downloads,
          likes: palette.likes,
          tags: palette.tags,
        }));

        setPalettes(formattedPalettes);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch palettes"
        );
        setLoading(false);
      }
    };

    fetchPalettes();
  }, []);

  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  if (loading) {
    return <div className="loading">Loading palettes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="palette-list">
      <h1>Lospec Color Palettes</h1>
      <div className="palettes-container">
        {palettes.map((palette) => (
          <div key={palette.id} className="palette-card">
            <div className="palette-header">
              <h2>{palette.title}</h2>
              {palette.creator && (
                <p className="creator">by {palette.creator}</p>
              )}
              <div className="stats">
                <span>❤️ {palette.likes}</span>
                <span>⬇️ {palette.downloads}</span>
              </div>
              <div className="tags">
                {palette.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="color-grid">
              {palette.colors.map((color, index) => (
                <div
                  key={`${palette.id}-${index}`}
                  className="color-box"
                  style={{
                    backgroundColor: `#${color}`,
                    color: getContrastColor(color),
                  }}
                >
                  <span className="hex">#{color.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LospecPaletteList;
