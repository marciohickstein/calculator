import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Calculator from './components/Calculator'

function App() {
  return (
    <>
      <div className="container text-center w-30 p-3 m-3" style={{ backgroundColor: "#eee", width: "500px" }}>
        <Calculator></Calculator>
      </div>
    </>
  )
}

export default App
