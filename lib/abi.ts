const abi ={
	"compiler": {
		"version": "0.8.28+commit.7893614a"
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
						"indexed": true,
						"internalType": "address",
						"name": "ocidAddress",
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
						"indexed": true,
						"internalType": "address",
						"name": "ocidAddress",
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
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "ocidAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "reason",
						"type": "string"
					}
				],
				"name": "EduTokensAwarded",
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
						"internalType": "enum EDUChain.ApplicationStatus",
						"name": "newStatus",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "updatedBy",
						"type": "address"
					}
				],
				"name": "StatusUpdated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "ocidAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "enum EDUChain.UserType",
						"name": "userType",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "UserOnboarded",
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
						"internalType": "enum EDUChain.ApplicationStatus",
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
					},
					{
						"internalType": "string",
						"name": "ocidHash",
						"type": "string"
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
								"internalType": "enum EDUChain.ApplicationStatus",
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
							},
							{
								"internalType": "string",
								"name": "ocidHash",
								"type": "string"
							}
						],
						"internalType": "struct EDUChain.Application",
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
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "getUserProfile",
				"outputs": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "message",
						"type": "string"
					},
					{
						"internalType": "enum EDUChain.UserType",
						"name": "userType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "eduTokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isOnboarded",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "ocidAddress",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "ocidToWallet",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_message",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "_shareEmail",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "_shareName",
						"type": "bool"
					},
					{
						"internalType": "enum EDUChain.UserType",
						"name": "_userType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "_ocidAddress",
						"type": "address"
					}
				],
				"name": "onboardUser",
				"outputs": [],
				"stateMutability": "nonpayable",
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
						"internalType": "enum EDUChain.ApplicationStatus",
						"name": "_newStatus",
						"type": "uint8"
					}
				],
				"name": "updateStatus",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "userProfiles",
				"outputs": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "message",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "shareEmail",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "shareName",
						"type": "bool"
					},
					{
						"internalType": "enum EDUChain.UserType",
						"name": "userType",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "isOnboarded",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "onboardingTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "eduTokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "ocidAddress",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "walletToOcid",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
		"devdoc": {
			"details": "Smart contract for the EDU Chain platform that handles user onboarding, application tracking, and reputation management with OCID integration",
			"kind": "dev",
			"methods": {
				"getApplication(bytes32)": {
					"params": {
						"_appId": "Identifier for the application"
					}
				},
				"getUserProfile(address)": {
					"params": {
						"_user": "Address of the user to fetch"
					}
				},
				"onboardUser(string,string,string,bool,bool,uint8,address)": {
					"params": {
						"_email": "User's email (can be empty if shareEmail is false)",
						"_message": "User's onboarding message",
						"_name": "User's name (can be empty if shareName is false)",
						"_ocidAddress": "The OCID address to link with this account",
						"_shareEmail": "Whether to share email publicly",
						"_shareName": "Whether to share name publicly",
						"_userType": "Type of user (Applicant or Recruiter)"
					}
				},
				"recordView(bytes32)": {
					"params": {
						"_appId": "Identifier for the application"
					}
				},
				"submitApplication(string,string)": {
					"params": {
						"_jobId": "Identifier for the job",
						"_metadataURI": "URI pointing to application metadata (IPFS)"
					}
				},
				"updateStatus(bytes32,uint8)": {
					"params": {
						"_appId": "Identifier for the application",
						"_newStatus": "New status to set for the application"
					}
				}
			},
			"title": "EDUChain",
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {
				"getApplication(bytes32)": {
					"notice": "Fetch application details"
				},
				"getUserProfile(address)": {
					"notice": "Get user profile (only shared fields if not own profile)"
				},
				"onboardUser(string,string,string,bool,bool,uint8,address)": {
					"notice": "Onboard a new user to the platform"
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
			"contracts/Ghosted.sol": "EDUChain"
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
		"contracts/Ghosted.sol": {
			"keccak256": "0xc52e18addeb95296ed4032ffd0edcffd0b12d8a77d5db39d9bd8681aef0481f1",
			"license": "MIT",
			"urls": [
				"bzz-raw://bf011f1fbd70e638bb4bff7ee63ad388e423336edf67de84a3262755e09cc799",
				"dweb:/ipfs/QmTngTTXNidpiV8BNo2NQU1wuFw2LG8PVKQ3f54EmxU1GG"
			]
		}
	},
	"version": 1
}
export default abi.output.abi;