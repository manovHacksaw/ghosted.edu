// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Ghosted {
    enum ApplicationStatus { Submitted, Viewed, Shortlisted, Rejected, InterviewScheduled, Hired }
    enum UserType { Applicant, Recruiter }

    struct Application {
        address applicant;
        string jobId;
        string metadataURI; // Stores off-chain resume & job details (IPFS or Filecoin)
        ApplicationStatus status;
        address recruiter;
        uint256 timestamp;
    }

    struct UserProfile {
        string name;
        string email;
        string message;
        bool shareEmail;
        bool shareName;
        UserType userType;
        bool isOnboarded;
        uint256 onboardingTimestamp;
        uint256 eduTokenBalance;
    }

    mapping(bytes32 => Application) public applications; // Mapping application ID to Application details
    mapping(address => UserProfile) public userProfiles; // Mapping user address to their profile
    
    event ApplicationSubmitted(bytes32 indexed appId, address indexed applicant, string jobId, string metadataURI);
    event ApplicationViewed(bytes32 indexed appId, address indexed recruiter, uint256 timestamp);
    event StatusUpdated(bytes32 indexed appId, ApplicationStatus newStatus);
    event UserOnboarded(
        address indexed user,
        string name,
        UserType userType,
        uint256 timestamp
    );
    event EduTokensAwarded(address indexed user, uint256 amount, string reason);

    /// @notice Onboard a new user to the platform
    /// @param _name User's name (can be empty if shareName is false)
    /// @param _email User's email (can be empty if shareEmail is false)
    /// @param _message User's onboarding message
    /// @param _shareEmail Whether to share email publicly
    /// @param _shareName Whether to share name publicly
    /// @param _userType Type of user (Applicant or Recruiter)
    function onboardUser(
        string memory _name,
        string memory _email,
        string memory _message,
        bool _shareEmail,
        bool _shareName,
        UserType _userType
    ) external {
        require(!userProfiles[msg.sender].isOnboarded, "User already onboarded");
        require(bytes(_message).length > 0, "Message is required");

        // Create user profile
        userProfiles[msg.sender] = UserProfile({
            name: _name,
            email: _email,
            message: _message,
            shareEmail: _shareEmail,
            shareName: _shareName,
            userType: _userType,
            isOnboarded: true,
            onboardingTimestamp: block.timestamp,
            eduTokenBalance: 0
        });

        // Award initial EDU tokens for onboarding
        _awardEduTokens(msg.sender, 100, "Initial onboarding reward");

        emit UserOnboarded(
            msg.sender,
            _shareName ? _name : "",
            _userType,
            block.timestamp
        );
    }

    /// @notice Internal function to award EDU tokens
    /// @param _user Address of the user to receive tokens
    /// @param _amount Amount of tokens to award
    /// @param _reason Reason for awarding tokens
    function _awardEduTokens(
        address _user,
        uint256 _amount,
        string memory _reason
    ) internal {
        userProfiles[_user].eduTokenBalance += _amount;
        emit EduTokensAwarded(_user, _amount, _reason);
    }

    /// @notice Get user profile (only shared fields if not own profile)
    /// @param _user Address of the user to fetch
    function getUserProfile(address _user) external view returns (
        string memory name,
        string memory email,
        string memory message,
        UserType userType,
        uint256 eduTokenBalance,
        bool isOnboarded
    ) {
        UserProfile memory profile = userProfiles[_user];
        
        // Return full profile for own address
        if (msg.sender == _user) {
            return (
                profile.name,
                profile.email,
                profile.message,
                profile.userType,
                profile.eduTokenBalance,
                profile.isOnboarded
            );
        }
        
        // Return only shared fields for other users
        return (
            profile.shareName ? profile.name : "",
            profile.shareEmail ? profile.email : "",
            profile.message,
            profile.userType,
            profile.eduTokenBalance,
            profile.isOnboarded
        );
    }

    /// @notice Submit a job application
    function submitApplication(string memory _jobId, string memory _metadataURI) external returns (bytes32) {
        require(userProfiles[msg.sender].isOnboarded, "User not onboarded");
        require(userProfiles[msg.sender].userType == UserType.Applicant, "Only applicants can submit");

        bytes32 appId = keccak256(abi.encodePacked(msg.sender, _jobId, block.timestamp));

        applications[appId] = Application({
            applicant: msg.sender,
            jobId: _jobId,
            metadataURI: _metadataURI,
            status: ApplicationStatus.Submitted,
            recruiter: address(0),
            timestamp: block.timestamp
        });

        // Award EDU tokens for application submission
        _awardEduTokens(msg.sender, 10, "Application submission reward");

        emit ApplicationSubmitted(appId, msg.sender, _jobId, _metadataURI);
        return appId;
    }

    /// @notice Record recruiter view on an application
    function recordView(bytes32 _appId) external {
        require(userProfiles[msg.sender].isOnboarded, "User not onboarded");
        require(userProfiles[msg.sender].userType == UserType.Recruiter, "Only recruiters can view");
        require(applications[_appId].applicant != address(0), "Application does not exist");
        require(applications[_appId].recruiter == address(0), "Already viewed");

        applications[_appId].recruiter = msg.sender;
        applications[_appId].status = ApplicationStatus.Viewed;
        applications[_appId].timestamp = block.timestamp;

        // Award EDU tokens to both parties
        _awardEduTokens(msg.sender, 5, "Application review reward");
        _awardEduTokens(applications[_appId].applicant, 5, "Application viewed reward");

        emit ApplicationViewed(_appId, msg.sender, block.timestamp);
    }

    /// @notice Update application status (Recruiters only)
    function updateStatus(bytes32 _appId, ApplicationStatus _newStatus) external {
        require(userProfiles[msg.sender].isOnboarded, "User not onboarded");
        require(userProfiles[msg.sender].userType == UserType.Recruiter, "Only recruiters can update");
        require(applications[_appId].recruiter == msg.sender, "Not authorized");
        require(_newStatus != ApplicationStatus.Submitted, "Invalid status update");

        applications[_appId].status = _newStatus;

        // Award EDU tokens for status updates
        if (_newStatus == ApplicationStatus.InterviewScheduled) {
            _awardEduTokens(applications[_appId].applicant, 20, "Interview scheduled reward");
        } else if (_newStatus == ApplicationStatus.Hired) {
            _awardEduTokens(applications[_appId].applicant, 100, "Hiring reward");
            _awardEduTokens(msg.sender, 50, "Successful hiring reward");
        }

        emit StatusUpdated(_appId, _newStatus);
    }

    /// @notice Fetch application details
    function getApplication(bytes32 _appId) external view returns (Application memory) {
        return applications[_appId];
    }
}