import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import slideone from "./image/slideone.jpg"
function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        {/* <ExampleCarouselImage text="First slide" /> */}
        {/* <img src={slideone} alt="" style={{width:'100vw',height:"400px"}}/> */}
        <img src="https://t3.ftcdn.net/jpg/03/14/97/00/240_F_314970095_YycKAeO9ouECG1l2xDFk7rIcJuN0nBWC.jpg" alt="" style={{width:'100vw',height:"400px"}}/>
        
        <Carousel.Caption>
          <h3>Wlecome To Mystore</h3>
          <p>Your one-stop shop for all your needs</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <ExampleCarouselImage text="Second slide" /> */}
        {/* <img src={slideone} alt="" style={{width:'70vw',height:"400px"}}/> */}
        <img src="https://as1.ftcdn.net/v2/jpg/07/02/38/18/1000_F_702381809_k0Jj93x9uwdtgqjja3mWDfWWj9ryHj7N.jpg" alt="" style={{width:'100vw',height:"400px"}}/>
        <Carousel.Caption>
          <h3>Wlecome To Mystore</h3>
          <p>Tryout New Outfits</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <ExampleCarouselImage text="Third slide" /> */}
        {/* <img src={slideone} alt="" style={{width:'70vw',height:"400px"}}/> */}
        <img src="https://t3.ftcdn.net/jpg/06/36/44/26/240_F_636442646_II8z4yhYbPoea8P6HoimUblo6ZQXzUXY.jpg" alt="" style={{width:'100vw',height:"400px"}}/>
        <Carousel.Caption>
          <h3>Wlecome To Mystore</h3>
          <p>
            Why Still Waiting Winter Sale Is Here Order Now Save More
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;