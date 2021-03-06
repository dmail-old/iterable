// return an iterable values until a value match condition

import proto from 'proto';

var ConditionalIterator = proto.extend('Mapped Iterator', {
	constructor(iterable, condition, bind){
		if( typeof condition != 'function' ) throw new TypeError('condition must be a function');
		if( false === Symbol.iterator in iterable ) throw new TypeError('not iterable', iterable);

		this.iterable = iterable;
		this.iterator = iterable[Symbol.iterator]();
		this.condition = condition;
		this.bind = bind;
		this.index = 0;
		this.done = false;
	},

	next(){
		if( this.done === true ){
			return {
				done: true,
				value: undefined
			};
		}

		var next = this.iterator.next();

		if( next.done === false ){
			if( this.condition.call(this.bind, next.value) ){
				this.done = true;
			}
		}

		return next;
	}
});

var ConditionalIterable = proto.extend('Mapped Iterable', {
	iterable: null,
	condition: null,
	bind: null,

	constructor(iterable, condition, bind){
		this.iterable = iterable;
		this.condition = condition;
		this.bind = bind;
	},

	[Symbol.iterator](){
		return ConditionalIterator.create(this.iterable, this.condition, this.bind);
	}
});

function breakIterableWhenValueMatch(iterable, fn, bind){
	return ConditionalIterable.create(iterable, fn, bind);
}

export default breakIterableWhenValueMatch;