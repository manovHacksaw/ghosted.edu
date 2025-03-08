export const abi = [{
	"compiler": {
		"version": "0.8.26+commit.8a97fa7a"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "appId",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "applicant",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "jobId",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "metadataURI",
						"type": "string"
					}
				],
				"name": "ApplicationSubmitted",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "appId",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "recruiter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "ApplicationViewed",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "appId",
						"type": "bytes32"
					},
					{
						"indexed": false,
						"internalType": "enum Ghosted.ApplicationStatus",
						"name": "newStatus",
						"type": "uint8"
					}
				],
				"name": "StatusUpdated",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "",
						"type": "bytes32"
					}
				],
				"name": "applications",
				"outputs": [
					{
						"internalType": "address",
						"name": "applicant",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "jobId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "metadataURI",
						"type": "string"
					},
					{
						"internalType": "enum Ghosted.ApplicationStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "recruiter",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "_appId",
						"type": "bytes32"
					}
				],
				"name": "getApplication",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "applicant",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "jobId",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "metadataURI",
								"type": "string"
							},
							{
								"internalType": "enum Ghosted.ApplicationStatus",
								"name": "status",
								"type": "uint8"
							},
							{
								"internalType": "address",
								"name": "recruiter",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							}
						],
						"internalType": "struct Ghosted.Application",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "_appId",
						"type": "bytes32"
					}
				],
				"name": "recordView",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_jobId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_metadataURI",
						"type": "string"
					}
				],
				"name": "submitApplication",
				"outputs": [
					{
						"internalType": "bytes32",
						"name": "",
						"type": "bytes32"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "_appId",
						"type": "bytes32"
					},
					{
						"internalType": "enum Ghosted.ApplicationStatus",
						"name": "_newStatus",
						"type": "uint8"
					}
				],
				"name": "updateStatus",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		"devdoc": {
			"kind": "dev",
			"methods": {},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {
				"getApplication(bytes32)": {
					"notice": "Fetch application details"
				},
				"recordView(bytes32)": {
					"notice": "Record recruiter view on an application"
				},
				"submitApplication(string,string)": {
					"notice": "Submit a job application"
				},
				"updateStatus(bytes32,uint8)": {
					"notice": "Update application status (Recruiters only)"
				}
			},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"edu.sol": "Ghosted"
		},
		"evmVersion": "cancun",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": false,
			"runs": 200
		},
		"remappings": []
	},
	"sources": {
		"edu.sol": {
			"keccak256": "0x4fbb44ef1dbf5043864befe2767ff5ba940656f3d37b0c572cc45df5c298fb7a",
			"license": "MIT",
			"urls": [
				"bzz-raw://6962e01a254e4f3105e12c34714c98174d28cc7a5c7d4f7f8dbefd17e6e756b1",
				"dweb:/ipfs/QmT4CPeQbVZ6XxyEJqquLk9Ld2e3sWbv1iq3PvnbEjUsk9"
			]
		}
	},
	"version": 1
}]