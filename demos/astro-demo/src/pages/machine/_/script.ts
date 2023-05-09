import { interpret } from '@xstate/fsm'
import machine from './machine.css' assert { type: 'machine', from: 'css' }

const service = interpret(machine)

const subscription = service.subscribe((state) => {
	console.log(state)
})

service.start()

service.send('toggle')

subscription.unsubscribe()

service.stop()
