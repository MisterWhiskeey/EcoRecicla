import ContainerDetails from '../ContainerDetails';

export default function ContainerDetailsExample() {
  const mockContainer = {
    id: "1",
    name: "Parque Central",
    latitude: -34.603722,
    longitude: -58.381592,
    fillLevel: 65,
    materials: ["Plástico", "Vidrio", "Papel"],
    address: "Av. Libertador 1234, Buenos Aires"
  };

  return (
    <div className="h-screen">
      <ContainerDetails
        container={mockContainer}
        onBack={() => console.log('Back clicked')}
      />
    </div>
  );
}
