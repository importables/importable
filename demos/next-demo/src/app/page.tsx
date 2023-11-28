import config from './config.yml' with { type: 'yaml' }

export default function Home() {
	return (
		<main>
			<h1>
				Do-Re-Mi
			</h1>
			{
				Object.entries(config).map(
					([ name, value ], key) => (
						<section key={key}>
							<h2>{
								name
							}</h2>
							<p>{
								value
							}</p>
						</section>
					)
				)
			}
			<a href="">
				Do
			</a>
		</main>
	)
}
