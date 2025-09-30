import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX, MapPin, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDistance } from "@/lib/geo-utils";

interface Container {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fillLevel: number;
  materials: string[];
  address: string;
  distance?: number;
}

interface MaterialInstruction {
  name: string;
  icon: string;
  accepted: boolean;
  instructions: string[];
}

interface ContainerDetailsProps {
  container: Container;
  onBack: () => void;
}

export default function ContainerDetails({ container, onBack }: ContainerDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const materialInstructions: MaterialInstruction[] = [
    {
      name: "Plástico",
      icon: "♻️",
      accepted: container.materials.includes("Plástico"),
      instructions: [
        "Enjuagar botellas y envases",
        "Quitar etiquetas si es posible",
        "Aplastar para ahorrar espacio",
        "No incluir plásticos sucios o contaminados"
      ]
    },
    {
      name: "Vidrio",
      icon: "🫙",
      accepted: container.materials.includes("Vidrio"),
      instructions: [
        "Enjuagar frascos y botellas",
        "Quitar tapas metálicas",
        "No incluir vidrios rotos o espejos",
        "Depositar con cuidado"
      ]
    },
    {
      name: "Papel",
      icon: "📄",
      accepted: container.materials.includes("Papel"),
      instructions: [
        "Mantener seco y limpio",
        "Aplanar cajas de cartón",
        "No incluir papel encerado o plastificado",
        "Quitar grapas y clips"
      ]
    },
    {
      name: "Latas",
      icon: "🥫",
      accepted: container.materials.includes("Latas"),
      instructions: [
        "Enjuagar antes de depositar",
        "Aplastar para ahorrar espacio",
        "Incluye latas de aluminio y acero",
        "Verificar que estén vacías"
      ]
    }
  ];

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Audio stopped' : 'Audio playing instructions');
  };

  const getFillLevelColor = (level: number) => {
    if (level < 40) return "text-container-empty";
    if (level < 80) return "text-container-medium";
    return "text-container-full";
  };

  const getFillLevelBg = (level: number) => {
    if (level < 40) return "bg-container-empty";
    if (level < 80) return "bg-container-medium";
    return "bg-container-full";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            data-testid="button-back"
            size="icon"
            variant="ghost"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{container.name}</h2>
            <p className="text-sm text-muted-foreground">{container.address}</p>
            {container.distance !== undefined && (
              <p className="text-sm font-medium text-blue-600 mt-1">
                📍 A {formatDistance(container.distance)} de distancia
              </p>
            )}
          </div>
          <Button
            data-testid="button-audio-toggle"
            size="icon"
            variant={isPlaying ? "default" : "outline"}
            onClick={handleAudioToggle}
          >
            {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nivel de llenado</span>
              <span className={`text-2xl font-bold ${getFillLevelColor(container.fillLevel)}`}>
                {container.fillLevel}%
              </span>
            </div>
            <Progress value={container.fillLevel} className="h-3" />
            {container.fillLevel >= 80 && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Contenedor casi lleno</p>
                  <p className="text-sm text-muted-foreground">
                    Considera buscar un contenedor alternativo
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materiales aceptados
          </h3>

          <Accordion type="single" collapsible className="space-y-2">
            {materialInstructions.map((material) => (
              <AccordionItem
                key={material.name}
                value={material.name}
                className={`border rounded-md ${!material.accepted ? 'opacity-50' : ''}`}
                disabled={!material.accepted}
              >
                <AccordionTrigger
                  data-testid={`accordion-material-${material.name}`}
                  className="px-4 hover:no-underline"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{material.icon}</span>
                    <span className="font-medium">{material.name}</span>
                    {!material.accepted && (
                      <Badge variant="outline" className="ml-2">No aceptado</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                {material.accepted && (
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Instrucciones de preparación:
                      </p>
                      {material.instructions.map((instruction, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2"
                          data-testid={`instruction-${material.name}-${idx}`}
                        >
                          <div className={`w-6 h-6 rounded-full ${getFillLevelBg(30)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className="text-xs font-bold text-white">{idx + 1}</span>
                          </div>
                          <p className="text-sm flex-1">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
