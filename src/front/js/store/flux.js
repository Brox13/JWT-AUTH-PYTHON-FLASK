const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			alert: null,
			loggedIn: false,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			setToken: (token) => {
				localStorage.setItem('access_token_jwt', token);
			},

			getToken: () => {
				return localStorage.getItem('access_token_jwt');
			},

			removeToken: () => {
				localStorage.setItem('access_token_jwt', '');
			},

			getSignup: async (data_front) => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/signup",
						{
							method: 'POST', headers: {
								'Content-Type': 'application/json'
							}, body: JSON.stringify(data_front)
						})
					const data = await resp.json()
					if (data.msg === 'ok') {
						setStore({ alert: "registered" })
						return data;
					}

				} catch (error) {
					console.log("Error loading message from backend", error)

				}
				setStore({ alert: "error" })
				setStore({ loggedIn: false })
				return null;
			},

			getLogin: async (data_front) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/login",
						{
							method: 'POST', headers: {
								'Content-Type': 'application/json'
							}, body: JSON.stringify(data_front)
						})
					const data = await resp.json()
					if (data.msg === "ok") {
						getActions().setToken(data.token)
						setStore({ loggedIn: true })
						return data;
					}

				} catch (error) {
					console.log("Error loading message from backend", error)
				}
				setStore({ alert: "error" })
				setStore({ loggedIn: false })
				return null;
			},

			getProtected: async (token) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/protected",
						{
							method: 'GET', headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + token,
							}
						})
					const data = await resp.json()

					if (data.msg === "ok") {
						setStore({ loggedIn: true });
						setStore({ alert: "loged in" })
						return data;
					}
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
				setStore({ alert: "error" })
				setStore({ loggedIn: false })
				return null;
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
