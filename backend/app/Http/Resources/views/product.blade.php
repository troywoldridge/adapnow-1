<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ $product->name }}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .option-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    select { padding: 8px; width: 220px; }
    .price { font-size: 1.5em; margin-top: 20px; }
  </style>
  <!-- Load React and ReactDOM from CDN -->
  <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <!-- Babel for JSX transformation in the browser -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    // Pass data from Laravel (PHP) to JavaScript
    const PRODUCT_DATA = @json([
      'product' => $product,
      'options' => $optionsData
    ]);
  </script>
  <!-- React App -->
  <script type="text/babel">
    function ProductPage() {
      const { product, options } = PRODUCT_DATA;
      
      // Initialize selected options to the first option of each group.
      const [selectedOptions, setSelectedOptions] = React.useState(() => {
        const initial = {};
        Object.keys(options).forEach(group => {
          if (options[group].length > 0) {
            initial[group] = options[group][0].id;
          }
        });
        return initial;
      });
      
      const [price, setPrice] = React.useState(parseFloat(product.price));
      
      // Function to call the AJAX pricing endpoint.
      const updatePrice = () => {
        const formData = new FormData();
        formData.append('product_id', product.id);
        Object.keys(selectedOptions).forEach(group => {
          formData.append('option_' + group, selectedOptions[group]);
        });
        
        // Call the API endpoint (defined in routes/api.php)
        fetch('/api/calculate_price', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.price !== undefined) {
            setPrice(data.price);
          } else {
            console.error("Invalid response:", data);
          }
        })
        .catch(error => console.error("Error updating price:", error));
      };
      
      // Update price whenever selected options change.
      React.useEffect(() => {
        updatePrice();
      }, [selectedOptions]);
      
      const handleSelectChange = (group, event) => {
        setSelectedOptions(prev => ({
          ...prev,
          [group]: event.target.value,
        }));
      };
      
      return (
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          
          {Object.keys(options).map(group => (
            <div key={group} className="option-group">
              <label htmlFor={`option_${group}`}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </label>
              <select 
                id={`option_${group}`} 
                value={selectedOptions[group]} 
                onChange={(e) => handleSelectChange(group, e)}>
                  {options[group].map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
              </select>
            </div>
          ))}
          
          <div className="price">
            Price: ${parseFloat(price).toFixed(2)}
          </div>
        </div>
      );
    }
    
    ReactDOM.render(<ProductPage />, document.getElementById('root'));
  </script>
</body>
</html>
<!-- This is a simple product page that uses React to dynamically update the price based on selected options. -->
<!-- The page is styled with basic CSS and uses React's state management to handle user interactions. -->
<!-- The product data and options are passed from Laravel to React using JSON, allowing for a seamless integration between the backend and frontend. -->
<!-- The AJAX call to fetch the updated price is made using the Fetch API, and the response is handled to update the state accordingly. -->
<!-- The script is written in JSX, which is transformed by Babel in the browser for compatibility with older browsers. -->
<!-- The page is designed to be responsive and user-friendly, providing a smooth experience for users selecting product options. -->