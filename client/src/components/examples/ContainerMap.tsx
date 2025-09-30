import ContainerMap from '../ContainerMap';

export default function ContainerMapExample() {
  const mockContainers = [
    {
      id: "1",
      name: "Parque Central",
      latitude: -34.603722,
      longitude: -58.381592,
      fillLevel: 25,
      materials: ["Plástico", "Vidrio", "Papel"],
      address: "Av. Libertador 1234"
    },
    {
      id: "2",
      name: "Plaza Italia",
      latitude: -34.583,
      longitude: -58.420,
      fillLevel: 65,
      materials: ["Plástico", "Latas"],
      address: "Av. Santa Fe 4567"
    },
    {
      id: "3",
      name: "Estación Norte",
      latitude: -34.588,
      longitude: -58.373,
      fillLevel: 90,
      materials: ["Papel", "Cartón"],
      address: "Av. Cabildo 890"
    },
    {
      id: "4",
      name: "Centro Comercial",
      latitude: -34.605,
      longitude: -58.395,
      fillLevel: 15,
      materials: ["Plástico", "Vidrio", "Latas", "Papel"],
      address: "Calle Florida 2345"
    },
    {
      id: "5",
      name: "Mercado Sur",
      latitude: -34.615,
      longitude: -58.385,
      fillLevel: 55,
      materials: ["Orgánico", "Plástico"],
      address: "Av. Belgrano 6789"
    },
  ];

  return (
    <div className="h-screen">
      <ContainerMap
        containers={mockContainers}
        onContainerSelect={(container) => console.log('Container selected:', container)}
        userLocation={{ lat: -34.603722, lng: -58.381592 }}
      />
    </div>
  );
}
