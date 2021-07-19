import {React, useState} from 'react'
import {loadStripe} from '@stripe/stripe-js'
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import axios from 'axios';
import "bootswatch/dist/lux/bootstrap.min.css"
import './App.css';
const stripePromise = loadStripe('pk_test_51J7KrtC0chK4q6tbr5DBduc0oStfUpChxM5LF50XhRVffQaviQrNSXL3RPRIWD8NkeCWzSDNNEm2p2vGf4XxHRvX00wXj0lbpv')
console.log(process.env.REACT_APP_STRIPE_PK)


const CheckoutForm = () =>{

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })
    setLoading(true)

    if (!error){
      const {id} = paymentMethod;


      try{
        const {data} = await axios.post('http://localhost:8080/api/checkout', {
          id,
          amount: 10000
        })

        console.log(data)
      } catch (error){
        console.log(error)
      }
      setLoading(false)

      //para limpiar los inputs
      elements.getElement(CardElement).clear();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img src="https://res.cloudinary.com/dintair/image/upload/v1610810788/aj5uxotkun9ddhhvdqb3.jpg" alt="box" className="img-fluid"/>
      
      <h1 className="text-center my-2">Price: $100.00</h1>
      <div className="form-group">
        <CardElement className="form-control"/>
      </div>
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="sr-only"/>
          </div>

          ): ("Buy")
        }
      </button>
    </form>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="col-md-4 offset-md-4">
          <CheckoutForm/>
        </div>
      </div>
    </Elements>
  );
}

export default App;
