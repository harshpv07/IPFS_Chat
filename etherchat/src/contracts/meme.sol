pragma solidity 0.5.0;
contract meme{
    string inshash;
    function set(string memory _inserthash) public {
        inshash = _inserthash;
    }
    function get() public view returns(string memory){
        return inshash;

    }

}