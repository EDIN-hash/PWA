import Modal from "react-modal";

Modal.setAppElement("#root");

export default function LoginModal({ isOpen, onClose, username, setUsername, password, setPassword, onSubmit }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-box w-full max-w-none sm:max-w-md p-4 sm:p-6 login-modal-dark"
            overlayClassName="modal-backdrop p-2 sm:p-0"
            contentLabel="Login Modal"
        >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Login</h2>
            <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
                <div className="form-control">
                    <label className="form-label text-sm sm:text-base text-white">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="form-label text-sm sm:text-base text-white">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                        required
                    />
                </div>
                <div className="button-group mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost bg-gray-600 hover:bg-gray-500 text-white w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                        Login
                    </button>
                </div>
            </form>
        </Modal>
    );
}
