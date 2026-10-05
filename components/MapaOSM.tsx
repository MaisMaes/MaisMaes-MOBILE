import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type Coord = { latitude: number; longitude: number };
type Ponto = Coord & { id: number | string; nome: string };

type Props = {
  centro: Coord; // localização atual da pessoa
  pontos: Ponto[]; // delegacias
  foco?: Coord | null; // quando muda, o mapa centraliza nesse ponto
};

// A política do OpenStreetMap pede um Referer identificando o app quando
// os tiles vêm de uma página web (que é o caso do WebView).
const ORIGEM = "https://mais-mae-web.vercel.app";

function montarHtml(centro: Coord, pontos: Ponto[]) {
  const dados = JSON.stringify({ centro, pontos }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<meta name="referrer" content="strict-origin-when-cross-origin"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#mapa{height:100%;margin:0}</style>
</head>
<body>
<div id="mapa"></div>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var d = ${dados};
  var mapa = L.map("mapa");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(mapa);

  var limites = [[d.centro.latitude, d.centro.longitude]];

  L.circleMarker(limites[0], {
    radius: 9, color: "#fff", weight: 3, fillColor: "#2f80ed", fillOpacity: 1
  }).addTo(mapa);

  d.pontos.forEach(function (p) {
    var titulo = document.createElement("b");
    titulo.textContent = p.nome; // textContent evita injeção de HTML vindo dos dados
    L.marker([p.latitude, p.longitude]).addTo(mapa).bindPopup(titulo);
    limites.push([p.latitude, p.longitude]);
  });

  mapa.fitBounds(limites, { padding: [40, 40], maxZoom: 16 });

  window.focar = function (lat, lon) {
    mapa.setView([lat, lon], 16, { animate: true });
  };
</script>
</body>
</html>`;
}

export default function MapaOSM({ centro, pontos, foco }: Props) {
  const ref = useRef<WebView>(null);
  const html = useMemo(() => montarHtml(centro, pontos), [centro, pontos]);

  useEffect(() => {
    if (!foco) return;
    ref.current?.injectJavaScript(
      `window.focar && window.focar(${foco.latitude}, ${foco.longitude}); true;`,
    );
  }, [foco]);

  return (
    <WebView
      ref={ref}
      style={styles.mapa}
      originWhitelist={["*"]}
      source={{ html, baseUrl: ORIGEM }}
      javaScriptEnabled
      domStorageEnabled
    />
  );
}

const styles = StyleSheet.create({
  mapa: {
    height: 260,
    width: "100%",
  },
});
