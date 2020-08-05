import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import { getProducts, editProduct, addProduct } from '../endpoints';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productAmount, setProductAmount] = useState(0);

  const handleGetProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products.data);
    } catch (e) {
      console.error(new Error(e).message);
    }
  }

  const handleEditModal = ({ id, name, price, amount }) => {
    setIsEditModal(true);
    setProductId(id);
    setProductName(name);
    setProductPrice(price);
    setProductAmount(amount);
  }

  const clearFormFields = () => {
    setProductId('');
    setProductName('');
    setProductPrice(0);
    setProductAmount(0);
  }

  const handleEditProduct = async () => {
    try {
      await editProduct(productId, {
        name: productName,
        price: productPrice,
        amount: productAmount
      });
      setIsEditModal(false);
      await handleGetProducts();
    } catch (e) {
      console.error(new Error(e).message);
    }
  };

  const handleAddProduct = async () => {
    try {
      await addProduct({
        name: productName,
        price: productPrice,
        amount: productAmount
      });
      setIsAddModal(false);
      await handleGetProducts();
    } catch (e) {
      console.error(new Error(e).message);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  useEffect(() => {
    clearFormFields();
  }, [isAddModal]);

  const ProductForm = <Form>
    <FormGroup>
      <Label for="productName">Product name</Label>
      <input id="productName" className="form-control" value={productName} onChange={e => setProductName(e.target.value)} />
    </FormGroup>
    <FormGroup>
      <Label for="productPrice">Price</Label>
      <input
        id="productPrice"
        type="number"
        className="form-control"
        value={productPrice}
        onChange={e => setProductPrice(e.target.valueAsNumber)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="productAmount">Amount</Label>
      <input
        id="productAmount"
        type="number"
        className="form-control"
        value={productAmount}
        onChange={e => setProductAmount(e.target.valueAsNumber)}
      />
    </FormGroup>
  </Form>

  return <>
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
      {products?.map(x =>
        <tr key={x.id}>
          <td>{x.name}</td>
          <td>${x.price.toFixed(2)}</td>
          <td>{x.amount}</td>
          <td><Button color="primary" onClick={() => handleEditModal(x)}>Edit</Button></td>
        </tr>
      )}
      </tbody>
    </Table>
    <Button className="d-block mx-auto" color="success" onClick={() => setIsAddModal(true)}>Add new product</Button>
    {isAddModal && <Modal isOpen={isAddModal} toggle={() => setIsAddModal(false)}>
      <ModalHeader toggle={() => setIsAddModal(false)}>Add product</ModalHeader>
      <ModalBody>{ProductForm}</ModalBody>
      <ModalFooter>
        <Button className="mx-auto" color="primary" onClick={handleAddProduct}>Save</Button>
      </ModalFooter>
    </Modal>}
    {isEditModal && <Modal isOpen={isEditModal} toggle={() => setIsEditModal(false)}>
      <ModalHeader toggle={() => setIsEditModal(false)}>Edit product</ModalHeader>
      <ModalBody>{ProductForm}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditProduct}>Save</Button>
        <Button color="danger" onClick={() => setIsEditModal(false)} className="ml-1">Cancel</Button>
      </ModalFooter>
    </Modal>}
  </>
}
