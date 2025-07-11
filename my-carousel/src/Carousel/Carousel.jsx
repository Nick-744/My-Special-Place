import cardsInfo from './CardsInfo'
import Card from './Card'

const Carousel = ({ radius = 1.5 }) => {
    const keys  = Object.keys(cardsInfo)
    const count = keys.length

    return (Array.from({ length: count }, (_, i) => (
        <Card
        key = {i}

        infoDict = {cardsInfo[keys[i]]}

        position = {[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius
        ]}
        rotation = {[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
    )));
}

export default Carousel;
