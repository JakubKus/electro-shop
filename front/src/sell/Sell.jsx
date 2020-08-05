import React, { useEffect, useState } from 'react';
import { getProducts, addPurchase } from '../endpoints';
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table
} from 'reactstrap';

export const Sell = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productData, setProductData] = useState({});
  const [productAmount, setProductAmount] = useState(0);
  const [isCartModal, setIsCartModal] = useState(false);
  const [isCheckoutModal, setIsCheckoutModal] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleGetProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products.data);
    } catch (e) {
      console.error(new Error(e).message);
    }
  }

  const handleCartModal = ({ id, name, price, amount }) => {
    setIsCartModal(true);
    setProductData({ id, name, price, amount });
  }

  const handleAddToCart = () => {
    if (typeof productAmount !== 'number') {
      setInputError('Value is invalid');
      return;
    } else if (productAmount < 0) {
      setInputError('Value is too small');
      return;
    } else if (productAmount > productData.amount) {
      setInputError('Value is too big');
      return;
    } else if (productAmount % 1 !== 0) {
      setInputError('Value is not an integer');
      return;
    }

    setIsCartModal(false);
    const product = { ...productData, amount: productAmount };
    setCart(prev => [...prev, product]);
    setProducts(products.map(x => x.id === product.id ? { ...x, amount: x.amount - product.amount } : x));
    setProductAmount(0);
    setProductData({});
  }

  const handleRemoveFromCart = product => {
    const updatedCart = [...cart];
    const productId = updatedCart.indexOf(product);
    updatedCart.splice(productId, 1);
    setCart(updatedCart);
    setProducts(products.map(x => x.id === product.id ? { ...x, amount: x.amount + product.amount } : x));
  }

  const handleCheckoutCart = async () => {
    const cartToAdd = cart.map(x => ({ productId: x.id, amount: x.amount }));
    setIsCheckoutModal(false);
    try {
      await addPurchase(cartToAdd);
      await handleGetProducts();
      setCart([]);
    } catch (e) {
      console.error(new Error(e).message);
    }
  }

  useEffect(() => {
    handleGetProducts();
  }, []);

  useEffect(() => {
    setProductAmount(0);
  }, [isCartModal]);

  return <>
    <h4 className="ml-2">Available products</h4>
    <Table striped bordered className="mb-4">
      <thead>
        <tr>
          <th width="40%">Product name</th>
          <th width="20%">Price</th>
          <th width="20%">Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {products?.map(x =>
        <tr key={x.id}>
          <td>{x.name}</td>
          <td>${x.price.toFixed(2)}</td>
          <td>{x.amount}</td>
          <td><Button color="primary" onClick={() => handleCartModal(x)}>Add to cart</Button></td>
        </tr>
      )}
      </tbody>
    </Table>
    <h4 className="ml-2">Cart</h4>
    <Table striped bordered>
      <thead>
        <tr>
          <th width="40%">Product name</th>
          <th width="20%">Price</th>
          <th width="20%">Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {cart?.map(x =>
        <tr key={x.id}>
          <td>{x.name}</td>
          <td>${x.price.toFixed(2)}</td>
          <td>{x.amount}</td>
          <td><Button color="primary" onClick={() => handleRemoveFromCart(x)}>Remove</Button></td>
        </tr>
      )}
      </tbody>
    </Table>
    {cart.length > 0 && <Button
      className="d-block mx-auto"
      color="success"
      onClick={() => setIsCheckoutModal(true)}
    >Checkout</Button>}
    {isCartModal && <Modal isOpen={isCartModal} toggle={() => setIsCartModal(false)}>
      <ModalHeader toggle={() => setIsCartModal(false)}>
        Add <span className="font-weight-bold">{productData.name}</span> to cart
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="productAmount">Amount</Label>
            <InputGroup>
              <input
                id="productAmount"
                type="number"
                className={`form-control ${!!inputError ? 'is-invalid' : ''}`}
                value={productAmount}
                onClick={() => setInputError('')}
                onChange={e => setProductAmount(e.target.valueAsNumber || '')}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>/ {productData.amount}</InputGroupText>
              </InputGroupAddon>
              <FormFeedback tooltip>{inputError}</FormFeedback>
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddToCart}>Add</Button>
        <Button color="danger" onClick={() => setIsCartModal(false)} className="ml-1">Cancel</Button>
      </ModalFooter>
    </Modal>}
    {isCheckoutModal && <Modal isOpen={isCheckoutModal} toggle={() => setIsCheckoutModal(false)}>
      <ModalHeader toggle={() => setIsCheckoutModal(false)}>Checkout</ModalHeader>
      <ModalBody>To pay: ${cart.reduce((x, y) => x + (y.price * y.amount), 0).toFixed(2)}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCheckoutCart}>Confirm</Button>
        <Button color="danger" onClick={() => setIsCheckoutModal(false)} className="ml-1">Cancel</Button>
      </ModalFooter>
    </Modal>}
  </>
}
