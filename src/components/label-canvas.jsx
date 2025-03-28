import { useRef, useState, useEffect } from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function LabelCanvas({ onLabelGenerated, initialText = 'Beylas Hemkoka',
  initialBgColor = '#ffffff', initialTextColor = '#003d07' }) {

  const canvasRef = useRef();
  const [text, setText] = useState(initialText);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [textColor, setTextColor] = useState(initialTextColor);
  const [font, setFont] = useState('serif');


  const canvasWidth = 800;
  const canvasHeight = 600;

  // Generate label when settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas and set background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add decorative border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

    // Add text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    // Title text
    ctx.font = `bold 60px ${font}`;
    ctx.fillText(text, canvasWidth / 2, 160);

    // Additional details
    ctx.font = `40px ${font}`;
    ctx.fillText('Premium Selection', canvasWidth / 2, 240);
    ctx.fillText('750ml', canvasWidth / 2, canvasHeight - 100);

    // Decorative line
    ctx.beginPath();
    ctx.moveTo(100, 280);
    ctx.lineTo(canvasWidth - 100, 280);
    ctx.stroke();

    // Vintage year
    ctx.font = `bold 48px ${font}`;
    ctx.fillText('2023', canvasWidth / 2, 360);
  }, [text, bgColor, textColor, font]);

  // Generate image data URL from canvas

  return (
    <Card className="cardContentColor">
      <CardContent className="p-4 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="wine-name">Text</Label>
            <Input id="wine-name" type="text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>


          <div className="grid gap-2">
            <Label htmlFor="font-select">Typsnitt</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger id="font-select">
                <SelectValue placeholder="Välj font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans-serif">Sans-serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
                <SelectItem value="cursive">Cursive</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bg-color">Bakgrundsfärg</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-8 p-0"
                />
                <span className="text-sm text-muted-foreground"></span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="text-color">Text Färg</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-8 p-0"
                />
                <span className="text-sm text-muted-foreground"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border rounded-md overflow-hidden">
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="w-full h-auto" />
        </div>
        <button onClick={() => onLabelGenerated(canvasRef.current.toDataURL('image/png'))}
          className="w-full py-2 px-4 bg-white hover:bg-gray-100 border rounded-md shadow-sm">
          Applicera På Etikett
        </button>
      </CardContent>
    </Card>
  )
}