const supportedCards = {
        visa, mastercard
      };
      
      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];
      
      const appState = {};
      
      const formatAsMoney = (amount, buyerCountry) => {
        const country =
          countries.find(country => country.country === buyerCountry) || countries[0];
        return amount.toLocaleString(`en-${country.code}`, {
          style: "currency",
          currency: country.currency
        });
      };
      
      const flagIfInvalid = (field, isValid) => {
        if (isValid){
          field.classList.remove('is-invalid');
        } else{
          field.classList.add('is-invalid');
        }
      };
      
      const expiryDateFormatIsValid = (target) => {
        return /^([0-9]{2})\/([0-9]{2}$)/.test(target.value);
      };
      
      const detectCardType = ({target}) => {
        const cardType = document.querySelector('div[data-credit-card]');
        const image = document.querySelector('img[data-card-type]');
        const targetValue = target.value;
        
        if(targetValue.startsWith(4)){
           cardType.classList.remove('is-mastercard');
           cardType.classList.add('is-visa');
           image.src= supportedCards.visa;  
          
           return 'is-visa';
        }else if(targetValue.startsWith(5)){
          cardType.classList.remove('is-visa');
          cardType.classList.add('is-mastercard');
          image.src = supportedCards.mastercard; 
          
          return 'is-mastercard';
        }else{
          cardType.classList.remove('is-visa');
          cardType.classList.remove('is-mastercard');
          image.src = 'https://placehold.it/120x60.png?text=Card';
        }
      };
      
      const validateCardExpiryDate = ({target}) => {
        const targetValue = target.value;
        const targetValueDate = new Date();
        
        targetValueDate.setFullYear('20' + targetValue.substr(3,2), targetValue.substr(0,2));
        
        const isValid = expiryDateFormatIsValid(target) && (targetValueDate > new Date());
        
        flagIfInvalid (target, isValid);
        
        return isValid;
      };
      
      const validateCardHolderName = ({target}) => {
        const isValid = /^([a-zA-Z]{3,}) ([a-zA-Z]{3,})$/.test(target.value);
        
        flagIfInvalid(target, isValid);
        
        return isValid;
      };
      
      const validateWithLuhn = (digits) => {
        if(digits.length === 16){        
        	let digits_sum = 0;
        
        	for(let i = digits.length - 1, doubled_digit; i >= 0; --i){
              	if(isNaN(digits[i])){
                  return false;
                }
              
              	doubled_digit = i % 2 ? digits[i] : digits[i] * 2;
          		
          		digits_sum += doubled_digit > 9 ? doubled_digit - 9 : doubled_digit;
        	}
        
        	return !(digits_sum % 10);
        }else{
          return false;
        }
      };
      
      const validateCardNumber = () => {
        const selectAll = (s) => {
          return document.querySelectorAll(s);
        };
        const fields = [...selectAll('div[data-cc-digits]>input')];
        const cardNumber = fields.reduce((acc, field)=>{
          return acc + field.value;
        },'').split('').map((digit)=>{
          return +digit;
        });
        
        const isValid = validateWithLuhn(cardNumber);
        
        const div = document.querySelector('div[data-cc-digits]');
        
        if(isValid){
          div.classList.remove('is-invalid');
          
        }else{
          div.classList.add('is-invalid');
        }
        
        return isValid;
      };
      
      const uiCanInteract = () => {
        document.querySelector('div[data-cc-digits]>input:first-child').addEventListener('blur', detectCardType);
        
        document.querySelector('div[data-cc-info]>input:first-child').addEventListener('blur', validateCardHolderName);
        
        document.querySelector('div[data-cc-info]>input:nth-child(2)').addEventListener('blur', validateCardExpiryDate);
        
        document.querySelector('button[data-pay-btn]').addEventListener('click', validateCardNumber);
        
        document.querySelector('div[data-cc-digits]>input:first-child').focus();
      };
      
      const displayCartTotal = ({results:results}) => {
        const [data] = results;
        
        const {itemsInCart, buyerCountry} = data; 
        
        appState.items = itemsInCart;
        appState.country = buyerCountry;
        appState.bill = itemsInCart.reduce((total, { price, qty }) => {
          return total + (price * qty);
        }, 0);
        appState.billFormatted = formatAsMoney(appState.bill, appState.country);
        
        document.querySelector('span[data-bill]').textContent = appState.billFormatted;
        
        uiCanInteract();
      };
      
      const fetchBill = () => {
        const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
        
        fetch(api)
          .then(response => response.json())
          .then(displayCartTotal)
          .catch(error => console.warn(error));
      };
      
      const startApp = () => {
        fetchBill();
      };
      
      startApp();