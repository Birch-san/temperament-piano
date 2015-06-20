/**
 * Created by birch on 20/06/2015.
 */
export default class Fraction {
	constructor(numerator:int, denominator:int = 1) {
		this.numerator = numerator;
		this.denominator = denominator;
		this.simplify();
	}

	multiply(coeff:int) {
		return this.multiply(new Fraction(coeff));
	}

	multiply(coeff:Fraction) {
		return new Fraction(
			this.numerator * coeff.numerator,
			this.denominator * coeff.denominator
		);
	}

	multiply(numerator:int, denominator:int) {
		return this.multiply(new Fraction(numerator, denominator));
	}

	divide(coeff:int) {
		return this.divide(new Fraction(coeff));
	}

	divide(coeff:Fraction) {
		return this.multiply(coeff.reciprocal());
	}

	divide(numerator:int, denominator:int) {
		return this.divide(new Fraction(numerator, denominator));
	}

	reciprocal() {
		return new Fraction(this.denominator, this.numerator);
	}

	simplify(){
		let greatestCommon = (function gcd(a,b){
			return b ? gcd(b, a%b) : a;
		})(this.numerator, this.denominator);
		this.numerator /= greatestCommon;
		this.denominator /= greatestCommon;
	}

	raise(power:int) {
		if (power<0) {
			return this.reciprocal().raise(Math.abs(power));
		}
		return new Fraction(
			Math.pow(this.numerator, power),
			Math.pow(this.denominator, power)
		);
	}

	qualify() {
		return this.numerator/this.denominator;
	}
}