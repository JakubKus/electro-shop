import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getPurchases, removePurchase } from '../endpoints';

export const Sales = () => {
  const [carts, setCarts] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [cartId, setCartId] = useState('');

  const handleGetCarts = async () => {
    try {
      const carts = await getPurchases();
      setCarts(carts.data);
    } catch (e) {
      console.error(new Error(e).message);
    }
  }

  const handleDeleteModal = cartId => {
    setCartId(cartId);
    setIsDeleteModal(true);
  }

  const handleDeleteCart = async () => {
    try {
      await removePurchase(cartId);
      setIsDeleteModal(false);
      setCartId('');
      await handleGetCarts();
    } catch (e) {
      console.error(new Error(e).message);
    }
  }

  useEffect(() => {
    handleGetCarts();
  }, []);

  return <>
  {carts?.map(x =>
    <Table key={x.id} striped bordered className="mb-4">
      <thead>
        <tr>
          <th width="40%">Product name</th>
          <th width="30%">Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
      {x.products.map(y =>
        <tr key={y.id}>
          <td>{y.name}</td>
          <td>${y.price.toFixed(2)}</td>
          <td>{y.amount}</td>
        </tr>
      )}
        <tr>
          <td><Button color="danger" onClick={() => handleDeleteModal(x.id)}>Delete</Button></td>
          <td colSpan={2}>
            Total price: ${x.products.reduce((x, y) => x + (y.price * y.amount), 0).toFixed(2)},
            added on: {new Date(x.addedOn).toLocaleDateString()}
          </td>
        </tr>
      </tbody>
    </Table>)}
    {isDeleteModal && <Modal isOpen={isDeleteModal} toggle={() => setIsDeleteModal(false)}>
      <ModalHeader toggle={() => setIsDeleteModal(false)}>Are you sure you want to delete this cart?</ModalHeader>
      <ModalBody>
        <Button color="primary" onClick={handleDeleteCart}>Confirm</Button>
        <Button color="danger" onClick={() => setIsDeleteModal(false)} className="ml-1">Cancel</Button>
      </ModalBody>
    </Modal>}
  </>
}
