
const form = document.getElementById('authForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const toggleModeBtn = document.getElementById('toggleMode');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const btnText = document.getElementById('btnText');

let isLoginMode = true;

const users = [
    { username: 'admin', password: 'Admin123!', email: 'admin@example.com' },
    { username: 'demo', password: 'Demo123!', email: 'demo@example.com' }
];

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type} show`;
}

function clearMessage() {
    message.className = 'message';
    message.textContent = '';
}

function toggleMode() {
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
       
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to your account';
        btnText.textContent = 'Sign In';
        toggleModeBtn.textContent = "Don't have an account? Sign up";
        
      
        document.getElementById('emailGroup').style.display = 'none';
        document.getElementById('confirmPasswordGroup').style.display = 'none';
        document.getElementById('passwordStrength').style.display = 'none';
    } else {
      
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Sign up for a new account';
        btnText.textContent = 'Sign Up';
        toggleModeBtn.textContent = 'Already have an account? Sign in';
        
        document.getElementById('emailGroup').style.display = 'block';
        document.getElementById('confirmPasswordGroup').style.display = 'block';
        document.getElementById('passwordStrength').style.display = 'block';
    }
    
    clearMessage();
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        showMessage('Login successful! Welcome back.', 'success');
    } else {
        showMessage('Invalid username or password', 'error');
    }
}


function handleSignup() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

  
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (users.find(u => u.username === username)) {
        showMessage('Username already exists', 'error');
        return;
    }

   
    users.push({ username, email, password });
    showMessage('Account created! You can now sign in.', 'success');
    
    
    
}


form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (isLoginMode) {
        handleLogin();
    } else {
        handleSignup();
    }
});


toggleModeBtn.addEventListener('click', toggleMode);