type ToastMessageProps = {
    title: string;
    description?: string[];
}

const ToastMessage = ({
	title,
	description = [],
}: ToastMessageProps) => {
	return (
		<div key={Math.random()}>
			{title}
            {description.map((message, index) => (
                <div key={index}>
                    <br />
                    {message}
                </div>
			))}
		</div>
	);
};

export default ToastMessage;
