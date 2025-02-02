import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';
import Rating from './Rating';


function Product(props) {
  const { product } = props;



  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className=" w-100 h-100" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title className='productname'>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>₹{product.price}</Card.Text>

      </Card.Body>
    </Card>
  );
}
export default Product;
