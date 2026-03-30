import { useMapEvents } from 'react-leaflet';

export default function MyComponent({ setLocation }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setLocation({ lat, lng });
        }
    });
    return null
}