// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NyayaVaultCore
 * @notice Sovereign Digital Evidence Management System - Core Immutability Anchor
 * @dev Compliant with Bharatiya Sakshya Adhiniyam, 2023 (BSA §63) & Bharatiya Nyaya Sanhita, 2023 (BNS §72)
 */
contract NyayaVaultCore {

    address public admin;

    enum AgencyType { None, Police, FSL, Prosecution, Judiciary }

    enum Verdict { Unregistered, VerifiedMaster, VerifiedRedacted, FlaggedTampered }

    struct AgencyPeer {
        address peerAddress;
        string agencyName;
        AgencyType agencyType;
        bool isAuthorized;
    }

    struct EvidenceRecord {
        bytes32 masterHash;      // SHA-256 of raw unredacted evidence
        bytes32 redactedHash;    // SHA-256 of Sec 72 BNS sanitized evidence (0x0 if none)
        string caseFirNumber;    // FIR Number (e.g., FIR-2026-001)
        string docType;          // "Witness Statement", "FIR", "Seizure Memo", "Forensic Report"
        address submittingOfficer; // Wallet address of the submitting investigator
        uint256 timestamp;       // Block timestamp
        uint256 blockNumber;     // Block number
        bool isSealed;           // Locked upon commit
        bool isTampered;         // Flagged if tampering detected
    }

    struct CustodyHandoff {
        bytes32 evidenceHash;
        address fromOfficer;
        address toOfficer;
        string stageName;
        uint256 timestamp;
        bytes digitalSignature;
        string notes;
    }

    // State Storage
    mapping(bytes32 => EvidenceRecord) public evidences;
    mapping(bytes32 => bytes32) public redactedToMaster; // Lookup master hash by redacted hash
    mapping(bytes32 => CustodyHandoff[]) public custodyChain;
    mapping(string => bytes32[]) private caseEvidences;
    mapping(address => AgencyPeer) public authorizedPeers;
    bytes32[] public allEvidenceHashes;

    // Events
    event EvidenceAnchored(
        bytes32 indexed masterHash,
        bytes32 indexed redactedHash,
        string caseFirNumber,
        address indexed submittingOfficer,
        uint256 timestamp
    );

    event CustodyTransferred(
        bytes32 indexed evidenceHash,
        address indexed fromOfficer,
        address indexed toOfficer,
        string stageName,
        uint256 timestamp
    );

    event TamperingFlagged(
        bytes32 indexed evidenceHash,
        address indexed reporter,
        string reason,
        uint256 timestamp
    );

    event PeerAuthorized(
        address indexed peerAddress,
        string agencyName,
        AgencyType agencyType
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "NyayaVault: Only admin permitted");
        _;
    }

    modifier onlyAuthorizedPeer() {
        require(
            authorizedPeers[msg.sender].isAuthorized || msg.sender == admin,
            "NyayaVault: Sender not an authorized consortium peer"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedPeers[msg.sender] = AgencyPeer({
            peerAddress: msg.sender,
            agencyName: "National Consortium Genesis Node",
            agencyType: AgencyType.Judiciary,
            isAuthorized: true
        });
    }

    /**
     * @notice Authorizes a police station, forensic lab, or judicial bench peer node.
     */
    function authorizePeer(
        address _peerAddress,
        string calldata _agencyName,
        AgencyType _agencyType
    ) external onlyAdmin {
        authorizedPeers[_peerAddress] = AgencyPeer({
            peerAddress: _peerAddress,
            agencyName: _agencyName,
            agencyType: _agencyType,
            isAuthorized: true
        });
        emit PeerAuthorized(_peerAddress, _agencyName, _agencyType);
    }

    /**
     * @notice Anchors raw master hash and optional Section 72 BNS redacted hash to the immutable ledger.
     */
    function anchorEvidence(
        bytes32 _masterHash,
        bytes32 _redactedHash,
        string calldata _caseFirNumber,
        string calldata _docType,
        bytes calldata _signature
    ) external onlyAuthorizedPeer returns (bool) {
        require(_masterHash != bytes32(0), "NyayaVault: Master hash cannot be empty");
        require(evidences[_masterHash].timestamp == 0, "NyayaVault: Master hash already anchored");

        EvidenceRecord memory record = EvidenceRecord({
            masterHash: _masterHash,
            redactedHash: _redactedHash,
            caseFirNumber: _caseFirNumber,
            docType: _docType,
            submittingOfficer: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number,
            isSealed: true,
            isTampered: false
        });

        evidences[_masterHash] = record;
        allEvidenceHashes.push(_masterHash);
        caseEvidences[_caseFirNumber].push(_masterHash);

        if (_redactedHash != bytes32(0)) {
            redactedToMaster[_redactedHash] = _masterHash;
        }

        // Initialize genesis custody record
        custodyChain[_masterHash].push(CustodyHandoff({
            evidenceHash: _masterHash,
            fromOfficer: address(0),
            toOfficer: msg.sender,
            stageName: "Evidence Ingested & Hashed (Genesis)",
            timestamp: block.timestamp,
            digitalSignature: _signature,
            notes: "Initial cryptographic anchor established"
        }));

        emit EvidenceAnchored(
            _masterHash,
            _redactedHash,
            _caseFirNumber,
            msg.sender,
            block.timestamp
        );

        return true;
    }

    /**
     * @notice Records an immutable chain-of-custody transfer between officers/agencies.
     */
    function appendCustodyHandoff(
        bytes32 _evidenceHash,
        address _toOfficer,
        string calldata _stageName,
        bytes calldata _signature,
        string calldata _notes
    ) external onlyAuthorizedPeer {
        require(evidences[_evidenceHash].timestamp > 0, "NyayaVault: Evidence not found");

        custodyChain[_evidenceHash].push(CustodyHandoff({
            evidenceHash: _evidenceHash,
            fromOfficer: msg.sender,
            toOfficer: _toOfficer,
            stageName: _stageName,
            timestamp: block.timestamp,
            digitalSignature: _signature,
            notes: _notes
        }));

        emit CustodyTransferred(
            _evidenceHash,
            msg.sender,
            _toOfficer,
            _stageName,
            block.timestamp
        );
    }

    /**
     * @notice Flags a document if an external tamper or breach attempt is detected.
     */
    function flagTampering(bytes32 _evidenceHash, string calldata _reason) external onlyAuthorizedPeer {
        require(evidences[_evidenceHash].timestamp > 0, "NyayaVault: Evidence not found");
        evidences[_evidenceHash].isTampered = true;
        emit TamperingFlagged(_evidenceHash, msg.sender, _reason, block.timestamp);
    }

    /**
     * @notice Mathematical verification gate for trial judges, prosecutors, and citizens.
     * @param _testHash The SHA-256 hash to test.
     * @return verdict 1 = VerifiedMaster, 2 = VerifiedRedacted, 3 = FlaggedTampered, 0 = Unregistered
     */
    function verifyIntegrity(bytes32 _testHash)
        external
        view
        returns (
            Verdict verdict,
            uint256 timestamp,
            uint256 blockNumber,
            string memory firNumber,
            string memory docType,
            address submittingOfficer,
            bool isTampered
        )
    {
        // 1. Check if directly matches master hash
        if (evidences[_testHash].timestamp > 0) {
            EvidenceRecord memory r = evidences[_testHash];
            if (r.isTampered) {
                return (Verdict.FlaggedTampered, r.timestamp, r.blockNumber, r.caseFirNumber, r.docType, r.submittingOfficer, true);
            }
            return (Verdict.VerifiedMaster, r.timestamp, r.blockNumber, r.caseFirNumber, r.docType, r.submittingOfficer, false);
        }

        // 2. Check if matches certified redacted derivative
        bytes32 masterFromRedacted = redactedToMaster[_testHash];
        if (masterFromRedacted != bytes32(0)) {
            EvidenceRecord memory mr = evidences[masterFromRedacted];
            if (mr.isTampered) {
                return (Verdict.FlaggedTampered, mr.timestamp, mr.blockNumber, mr.caseFirNumber, mr.docType, mr.submittingOfficer, true);
            }
            return (Verdict.VerifiedRedacted, mr.timestamp, mr.blockNumber, mr.caseFirNumber, mr.docType, mr.submittingOfficer, false);
        }

        // 3. Not registered on ledger
        return (Verdict.Unregistered, 0, 0, "", "", address(0), false);
    }

    /**
     * @notice Returns complete chain-of-custody log for an evidence item.
     */
    function getCustodyChain(bytes32 _evidenceHash) external view returns (CustodyHandoff[] memory) {
        return custodyChain[_evidenceHash];
    }

    /**
     * @notice Returns all evidence hashes linked to an FIR case.
     */
    function getCaseEvidences(string calldata _firNumber) external view returns (bytes32[] memory) {
        return caseEvidences[_firNumber];
    }

    /**
     * @notice Returns total count of anchored evidence records.
     */
    function getTotalEvidenceCount() external view returns (uint256) {
        return allEvidenceHashes.length;
    }
}
