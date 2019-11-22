
var $estr = function() { return js_Boot.__string_rec(this,''); };

function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}

var Brotli = function(dictionary_path) {
	if(dictionary_path == null) {
		dictionary_path = "dictionary.txt";
	}
	var dictionary = this.OpenInputAjax(dictionary_path);
	var DictionaryHash = this.OpenInputAjax("DictionaryHash.txt");
	var DictionaryWords = this.OpenInputAjax("DictionaryWords.txt");
	var DictionaryBuckets = this.OpenInputAjax("DictionaryBuckets.txt");
	decode_Dictionary.kBrotliDictionary = dictionary;
	encode_Dictionary.kBrotliDictionary = dictionary;
	var kStaticDictionaryHash = encode_Dictionary_$hash.kStaticDictionaryHash;
	var kStaticDictionaryBuckets = encode_Static_$dict_$lut.kStaticDictionaryBuckets;
	var _g = 0;
	while(_g < 32768) {
		var i = _g++;
		kStaticDictionaryHash.push(DictionaryHash[i * 2 + 1] << 8 | DictionaryHash[i * 2]);
		kStaticDictionaryBuckets.push(DictionaryBuckets[i * 3 + 2] << 16 | DictionaryBuckets[i * 3 + 1] << 8 | DictionaryBuckets[i * 3]);
	}
	var kStaticDictionaryWords = encode_Static_$dict_$lut.kStaticDictionaryWords;
	var _g1 = 0;
	while(_g1 < 31704) {
		var i1 = _g1++;
		kStaticDictionaryWords.push(new encode_static_$dict_$lut_DictWord(DictionaryWords[i1 * 3 + 1] >>> 3,DictionaryWords[i1 * 3 + 2],(DictionaryWords[i1 * 3 + 1] & 7) << 8 | DictionaryWords[i1 * 3]));
	}
};


Brotli.__name__ = true;
Brotli.prototype = {
	OpenInputAjax: function(input_path) {
		var this1 = new Array(0);
		var response = this1;
		var http = js_Browser.createXMLHttpRequest();
		http.open("get",input_path,false);
		if($bind(http,http.overrideMimeType) != null) {
			http.overrideMimeType("text/plain; charset=x-user-defined");
		} else {
			http.setRequestHeader("Accept-Charset","x-user-defined");
		}
		http.send(null);
		if(http.readyState == 4) {
			if(http["responseBody"] != null) {
				response = http["responseBody"]["toArray"]();
			} else if(http.responseText != null) {
				var responseText = http.responseText.split("");
				var length = responseText.length;
				var this2 = new Array(length);
				response = this2;
				var _g1 = 0;
				var _g = responseText.length;
				while(_g1 < _g) {
					var i = _g1++;
					response[i] = HxOverrides.cca(responseText[i],0) & 255;
				}
			}
		}
		return response;
	}
	,Ajax: function(input_path) {
		var http = js_Browser.createXMLHttpRequest();
		http.open("get",input_path,false);
		if($bind(http,http.overrideMimeType) != null) {
			http.overrideMimeType("text/plain; charset=x-user-defined");
		} else {
			http.setRequestHeader("Accept-Charset","x-user-defined");
		}
		http.send(null);
		return http.responseText;
	}
	,decompress: function(content) {
		var fin = [];
		var _g1 = 0;
		var _g = content.length;
    console.log(_g)
		while(_g1 < _g) {
			var i = _g1++;
			fin[i] = content.charCodeAt(i);
		}
		var fout = [];
		var input = decode_Streams.BrotliInitMemInput(fin,fin.length);
    console.log(input)
		var output = decode_Streams.BrotliInitMemOutput(fout);
    console.log(output)
		decode_Decode.BrotliDecompress(input,output);
    console.log(output)
		var bytes = new haxe_io_Bytes(new ArrayBuffer(output.data_.pos));
		var _g11 = 0;
		var _g2 = output.data_.pos;
		while(_g11 < _g2) {
			var i1 = _g11++;
			bytes.b[i1] = output.data_.buffer[i1] & 255;
		}
    console.log(bytes)
		return bytes.getString(0,output.data_.pos);
	}
	,compress: function(content,quality) {
		if(quality < 0 || quality > 11) {
			console.log("Quality 0...11");
			return null;
		}
		var fin = [];
		var _g1 = 0;
		var _g = content.length;
		while(_g1 < _g) {
			var i = _g1++;
			fin[i] = content.charCodeAt(i);
		}
		var fout = [];
		var params = new encode_encode_BrotliParams();
		params.quality = quality;
		var output = new encode_streams_BrotliMemOut(fout);
		encode_Encode.BrotliCompress(params,new encode_streams_BrotliMemIn(fin,fin.length),output);
		var bytes = new haxe_io_Bytes(new ArrayBuffer(output.position()));
		var _g11 = 0;
		var _g2 = output.position();
		while(_g11 < _g2) {
			var i1 = _g11++;
			bytes.b[i1] = output.buf_[i1] & 255;
		}
		return bytes.getString(0,output.position());
	}
	,decompressArray: function(content) {
		var fin = content;
		var fout = [];
		var input = decode_Streams.BrotliInitMemInput(fin,fin.length);
		var output = decode_Streams.BrotliInitMemOutput(fout);
		decode_Decode.BrotliDecompress(input,output);
		return output.data_.buffer.slice(0,output.data_.pos);
	}
	,compressArray: function(content,quality) {
		if(quality < 0 || quality > 11) {
			console.log("Quality 0...11");
			return null;
		}
		var fin = content;
		var fout = [];
		var params = new encode_encode_BrotliParams();
		params.quality = quality;
		var output = new encode_streams_BrotliMemOut(fout);
		encode_Encode.BrotliCompress(params,new encode_streams_BrotliMemIn(fin,fin.length),output);
		var bytes = new haxe_io_Bytes(new ArrayBuffer(output.position()));
		var _g1 = 0;
		var _g = output.position();
		while(_g1 < _g) {
			var i = _g1++;
			bytes.b[i] = output.buf_[i] & 255;
		}
		return output.buf_.slice(0,output.position());
	}
	,__class__: Brotli
};

var DefaultFunctions = function() {
};

DefaultFunctions.__name__ = true;
DefaultFunctions.memcpy_Int = function(dst,dst_offset,src,src_offset,count) {
	var _g1 = 0;
	while(_g1 < count) {
		var i = _g1++;
		dst[dst_offset + i] = src[src_offset + i];
	}
};
DefaultFunctions.memset_Int = function(b,offset,v,count) {
	var _g1 = 0;
	while(_g1 < count) b[offset + _g1++] = v;
};
DefaultFunctions.memcpy_UInt = function(dst,dst_offset,src,src_offset,count) {
	var _g1 = 0;
	while(_g1 < count) {
		var i = _g1++;
		dst[dst_offset + i] = src[src_offset + i];
	}
};
DefaultFunctions.memset_UInt = function(b,offset,v,count) {
	var _g1 = 0;
	while(_g1 < count) b[offset + _g1++] = v;
};
DefaultFunctions.memcpyArray = function(dst,dst_offset,src,src_offset,count) {
	var _g1 = 0;
	while(_g1 < count) {
		var i = _g1++;
		dst[dst_offset + i] = src[src_offset + i];
	}
};
DefaultFunctions.memcpyVectorArray = function(dst,dst_offset,src,src_offset,count) {
	var _g1 = 0;
	while(_g1 < count) {
		var i = _g1++;
		dst[dst_offset + i] = src[src_offset + i];
	}
};
DefaultFunctions.memcpyArrayVector = function(dst,dst_offset,src,src_offset,count) {
	var _g1 = 0;
	while(_g1 < count) {
		var i = _g1++;
		dst[dst_offset + i] = src[src_offset + i];
	}
};
DefaultFunctions.prototype = {
	__class__: DefaultFunctions
};
var FunctionMalloc = function() {
};
FunctionMalloc.__name__ = true;
FunctionMalloc.mallocArray_encode_hash_BackwardMatch = function(t,a) {
	var arr = [];
	var _g1 = 0;
	while(_g1 < a) arr[_g1++] = new encode_hash_BackwardMatch();
	return arr;
};
FunctionMalloc.malloc_encode_backward_references_ZopfliNode = function(t,a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = new encode_backward_$references_ZopfliNode();
	return arr;
};
FunctionMalloc.malloc2__encode_backward_references_Pair = function(t,a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = new encode_backward_$references_Pair(0,0);
	return arr;
};
FunctionMalloc.malloc2_decode_huffman_HuffmanCode = function(t,a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = new decode_huffman_HuffmanCode(0,0);
	return arr;
};
FunctionMalloc.malloc_decode_huffman_HuffmanTreeGroup = function(t,a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = new decode_huffman_HuffmanTreeGroup();
	return arr;
};
FunctionMalloc.mallocUInt = function(a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = 0;
	return arr;
};
FunctionMalloc.mallocInt = function(a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = 0;
	return arr;
};
FunctionMalloc.mallocFloat = function(a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = 0;
	return arr;
};
FunctionMalloc.mallocBool = function(a) {
	var arr = new Array(a);
	var _g1 = 0;
	var _g = a;
	while(_g1 < _g) arr[_g1++] = false;
	return arr;
};
FunctionMalloc.prototype = {
	__class__: FunctionMalloc
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
var decode_Decode = function() { };
decode_Decode.__name__ = true;
decode_Decode.BROTLI_FAILURE = function() {
	return 0;
};
decode_Decode.BROTLI_LOG_UINT = function(x) {
};
decode_Decode.BROTLI_LOG_ARRAY_INDEX = function(array_name,idx) {
};
decode_Decode.BROTLI_LOG = function(x) {
	console.log(x);
};
decode_Decode.BROTLI_LOG_UCHAR_VECTOR = function(v,len) {
};
decode_Decode.DecodeWindowBits = function(br) {
	var n;
	if(decode_BitReader.BrotliReadBits(br,1) == 0) {
		return 16;
	}
	n = decode_BitReader.BrotliReadBits(br,3);
	if(n > 0) {
		return 17 + n;
	}
	n = decode_BitReader.BrotliReadBits(br,3);
	if(n > 0) {
		return 8 + n;
	}
	return 17;
};
decode_Decode.DecodeVarLenUint8 = function(br) {
	if(decode_BitReader.BrotliReadBits(br,1) == 1) {
		var nbits = decode_BitReader.BrotliReadBits(br,3);
		if(nbits == 0) {
			return 1;
		} else {
			return decode_BitReader.BrotliReadBits(br,nbits) + (1 << nbits);
		}
	}
	return 0;
};
decode_Decode.JumpToByteBoundary = function(br) {
	return decode_BitReader.BrotliReadBits(br,(br.bit_pos_ + 7 & -8) - br.bit_pos_) == 0;
};
decode_Decode.DecodeMetaBlockLength = function(br,meta_block_length,input_end,is_metadata,is_uncompressed) {
	var size_nibbles;
	var size_bytes;
	input_end[0] = decode_BitReader.BrotliReadBits(br,1);
	meta_block_length[0] = 0;
	is_uncompressed[0] = 0;
	is_metadata[0] = 0;
	if(input_end[0] == 1 && decode_BitReader.BrotliReadBits(br,1) == 1) {
		return true;
	}
	size_nibbles = decode_BitReader.BrotliReadBits(br,2) + 4;
	if(size_nibbles == 7) {
		is_metadata[0] = 1;
		if(decode_BitReader.BrotliReadBits(br,1) != 0) {
			return false;
		}
		size_bytes = decode_BitReader.BrotliReadBits(br,2);
		if(size_bytes == 0) {
			return true;
		}
		var _g1 = 0;
		while(_g1 < size_bytes) {
			var i = _g1++;
			var next_byte = decode_BitReader.BrotliReadBits(br,8);
			if(i + 1 == size_bytes && size_bytes > 1 && next_byte == 0) {
				return false;
			}
			meta_block_length[0] |= next_byte << i * 8;
		}
	} else {
		var _g11 = 0;
		while(_g11 < size_nibbles) {
			var i1 = _g11++;
			var next_nibble = decode_BitReader.BrotliReadBits(br,4);
			if(i1 + 1 == size_nibbles && size_nibbles > 4 && next_nibble == 0) {
				return false;
			}
			meta_block_length[0] |= next_nibble << i1 * 4;
		}
	}
	++meta_block_length[0];
	if(input_end[0] != 1 && is_metadata[0] != 1) {
		is_uncompressed[0] = decode_BitReader.BrotliReadBits(br,1);
	}
	return true;
};
decode_Decode.ReadSymbol = function(table,table_off,br) {
	var nbits;
	decode_BitReader.BrotliFillBitWindow(br);
	table_off = table_off + (br.val_ >>> br.bit_pos_ & 255);
	if(_$UInt_UInt_$Impl_$.gt(table[table_off].bits,8)) {
		br.bit_pos_ = br.bit_pos_ + 8;
		nbits = table[table_off].bits - 8;
		table_off = table_off + table[table_off].value;
		table_off = table_off + (br.val_ >>> br.bit_pos_ & (1 << nbits) - 1);
	}
	br.bit_pos_ = br.bit_pos_ + table[table_off].bits;
	return table[table_off].value;
};
decode_Decode.ReadHuffmanCodeLengths = function(code_length_code_lengths,num_symbols,code_lengths,s) {
	var br = s.br;
	if(s.sub_state[1] == 60) {
		s.symbol = 0;
		s.prev_code_len = 8;
		s.repeat = 0;
		s.repeat_code_len = 0;
		s.space = 32768;
		if(decode_Huffman.BrotliBuildHuffmanTable(s.table,0,5,code_length_code_lengths,18) <= 1) {
			console.log("[ReadHuffmanCodeLengths] Building code length tree failed: ");
			return 0;
		}
		s.sub_state[1] = 61;
	}
	if(s.sub_state[1] == 61) {
		while(s.symbol < num_symbols && s.space > 0) {
			var p = s.table;
			var p_off = 0;
			var code_len;
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				return 2;
			}
			decode_BitReader.BrotliFillBitWindow(br);
			p_off = 0 + (br.val_ >>> br.bit_pos_ & 31);
			br.bit_pos_ = br.bit_pos_ + p[p_off].bits;
			code_len = p[p_off].value;
			code_lengths[s.symbol] = code_len;
			if(_$UInt_UInt_$Impl_$.gt(16,code_len)) {
				s.repeat = 0;
				if(code_len != 0) {
					s.prev_code_len = code_len;
					s.space -= 32768 >> code_len;
				}
				s.symbol++;
			} else {
				var extra_bits = code_len - 14;
				var old_repeat;
				var repeat_delta;
				var new_len = 0;
				if(code_len == 16) {
					new_len = s.prev_code_len;
				}
				if(s.repeat_code_len != new_len) {
					s.repeat = 0;
					s.repeat_code_len = new_len;
				}
				old_repeat = s.repeat;
				if(s.repeat > 0) {
					s.repeat = (s.repeat -= 2) << extra_bits;
				}
				s.repeat = s.repeat + (decode_BitReader.BrotliReadBits(br,extra_bits) + 3);
				repeat_delta = s.repeat - old_repeat;
				if(s.symbol + repeat_delta > num_symbols) {
					return 0;
				}
				DefaultFunctions.memset_UInt(code_lengths,s.symbol,s.repeat_code_len,repeat_delta);
				s.symbol += repeat_delta;
				if(s.repeat_code_len != 0) {
					s.space -= repeat_delta << 15 - s.repeat_code_len;
				}
			}
		}
		if(s.space != 0) {
			console.log("[ReadHuffmanCodeLengths] s.space = " + s.space + "\n");
			return 0;
		}
		DefaultFunctions.memset_UInt(code_lengths,s.symbol,0,num_symbols - s.symbol);
		s.sub_state[1] = 50;
		return 1;
	}
	return 0;
};
decode_Decode.ReadHuffmanCode = function(alphabet_size,table,table_off,opt_table_size,s) {
	var br = s.br;
	var result = 1;
	var table_size = 0;
	while(true) {
		if(s.sub_state[1] == 50) {
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				return 2;
			}
			s.code_lengths = new Array(alphabet_size);
			if(s.code_lengths == null) {
				return 0;
			}
			s.simple_code_or_skip = decode_BitReader.BrotliReadBits(br,2);
			if(s.simple_code_or_skip == 1) {
				var i;
				var max_bits_counter = alphabet_size - 1;
				var max_bits = 0;
				var symbols = [0,0,0,0];
				var num_symbols = decode_BitReader.BrotliReadBits(br,2) + 1;
				while(max_bits_counter > 0) {
					max_bits_counter >>= 1;
					++max_bits;
				}
				DefaultFunctions.memset_UInt(s.code_lengths,0,0,alphabet_size);
				var _g1 = 0;
				var _g = num_symbols;
				while(_g1 < _g) {
					var i1 = _g1++;
					symbols[i1] = decode_BitReader.BrotliReadBits(br,max_bits);
					if(symbols[i1] >= alphabet_size) {
						return 0;
					}
					s.code_lengths[symbols[i1]] = 2;
				}
				s.code_lengths[symbols[0]] = 1;
				switch(num_symbols) {
				case 1:
					break;
				case 2:
					if(symbols[0] == symbols[1]) {
						return 0;
					}
					s.code_lengths[symbols[1]] = 1;
					break;
				case 3:
					if(symbols[0] == symbols[1] || symbols[0] == symbols[2] || symbols[1] == symbols[2]) {
						return 0;
					}
					break;
				case 4:
					if(symbols[0] == symbols[1] || symbols[0] == symbols[2] || symbols[0] == symbols[3] || symbols[1] == symbols[2] || symbols[1] == symbols[3] || symbols[2] == symbols[3]) {
						return 0;
					}
					if(decode_BitReader.BrotliReadBits(br,1) == 1) {
						s.code_lengths[symbols[2]] = 3;
						s.code_lengths[symbols[3]] = 3;
					} else {
						s.code_lengths[symbols[0]] = 2;
					}
					break;
				}
				s.sub_state[1] = 62;
				continue;
			} else {
				var i2;
				var space = 32;
				var num_codes = 0;
				var huff = [new decode_huffman_HuffmanCode(2,0),new decode_huffman_HuffmanCode(2,4),new decode_huffman_HuffmanCode(2,3),new decode_huffman_HuffmanCode(3,2),new decode_huffman_HuffmanCode(2,0),new decode_huffman_HuffmanCode(2,4),new decode_huffman_HuffmanCode(2,3),new decode_huffman_HuffmanCode(4,1),new decode_huffman_HuffmanCode(2,0),new decode_huffman_HuffmanCode(2,4),new decode_huffman_HuffmanCode(2,3),new decode_huffman_HuffmanCode(3,2),new decode_huffman_HuffmanCode(2,0),new decode_huffman_HuffmanCode(2,4),new decode_huffman_HuffmanCode(2,3),new decode_huffman_HuffmanCode(4,5)];
				var _g2 = 0;
				while(_g2 < 18) s.code_length_code_lengths[_g2++] = 0;
				var _g3 = s.simple_code_or_skip;
				while(_g3 < 18) {
					var i3 = _g3++;
					if(space <= 0) {
						break;
					}
					var code_len_idx = decode_Decode.kCodeLengthCodeOrder[i3];
					var p = huff;
					var p_off = 0;
					var v;
					decode_BitReader.BrotliFillBitWindow(br);
					p_off = p_off + (br.val_ >>> br.bit_pos_ & 15);
					br.bit_pos_ = br.bit_pos_ + p[p_off].bits;
					v = p[p_off].value;
					s.code_length_code_lengths[code_len_idx] = v;
					if(v != 0) {
						space -= 32 >> v;
						++num_codes;
					}
				}
				if(!(num_codes == 1 || space == 0)) {
					return 0;
				}
				s.sub_state[1] = 60;
			}
		}
		if(s.sub_state[1] == 60 || s.sub_state[1] == 61) {
			result = decode_Decode.ReadHuffmanCodeLengths(s.code_length_code_lengths,alphabet_size,s.code_lengths,s);
			if(result != 1) {
				return result;
			}
			s.sub_state[1] = 62;
		}
		if(s.sub_state[1] == 62) {
			table_size = decode_Huffman.BrotliBuildHuffmanTable(table,table_off,8,s.code_lengths,alphabet_size);
			if(table_size == 0) {
				console.log("[ReadHuffmanCode] BuildHuffmanTable failed: ");
				return 0;
			}
			s.code_lengths = null;
			if(opt_table_size != null) {
				opt_table_size[0] = table_size;
			}
			s.sub_state[1] = 50;
			return result;
		}
	}
};
decode_Decode.ReadBlockLength = function(table,table_off,br) {
	var code;
	var nbits;
	code = decode_Decode.ReadSymbol(table,table_off,br);
	nbits = decode_Prefix.kBlockLengthPrefixCode[code].nbits;
	return decode_Prefix.kBlockLengthPrefixCode[code].offset + decode_BitReader.BrotliReadBits(br,nbits);
};
decode_Decode.TranslateShortCodes = function(code,ringbuffer,index) {
	var val;
	if(code < 16) {
		index += decode_Decode.kDistanceShortCodeIndexOffset[code];
		index &= 3;
		val = ringbuffer[index] + decode_Decode.kDistanceShortCodeValueOffset[code];
	} else {
		val = code - 16 + 1;
	}
	return val;
};
decode_Decode.InverseMoveToFrontTransform = function(v,v_len) {
	var mtf = new Array(256);
	var i;
	var _g = 0;
	while(_g < 256) {
		var i1 = _g++;
		mtf[i1] = i1;
	}
	var _g1 = 0;
	var _g2 = v_len;
	while(_g1 < _g2) {
		var i2 = _g1++;
		var index = v[i2];
		var value = mtf[index];
		v[i2] = value;
		while(_$UInt_UInt_$Impl_$.gt(index,0)) {
			mtf[index] = mtf[index - 1];
			--index;
		}
		mtf[0] = value;
	}
};
decode_Decode.HuffmanTreeGroupDecode = function(group,s) {
	if(s.sub_state[0] == 50) {
		s.next = group.codes;
		s.htree_index = 0;
		s.sub_state[0] = 70;
	}
	if(s.sub_state[0] == 70) {
		var next_off = 0;
		while(s.htree_index < group.num_htrees) {
			var table_size = [];
			var result = decode_Decode.ReadHuffmanCode(group.alphabet_size,s.next,next_off,table_size,s);
			if(result != 1) {
				return result;
			}
			group.htrees[s.htree_index] = s.next;
			group.htrees_off[s.htree_index] = next_off;
			next_off += table_size[0];
			if(table_size[0] == 0) {
				return 0;
			}
			++s.htree_index;
		}
		s.sub_state[0] = 50;
		return 1;
	}
	return 0;
};
decode_Decode.DecodeContextMap = function(context_map_size,num_htrees,context_map,s) {
	var br = s.br;
	var result = 1;
	var use_rle_for_zeros;
	if(s.sub_state[0] == 50) {
		if(!decode_BitReader.BrotliReadMoreInput(br)) {
			return 2;
		}
		num_htrees[0] = decode_Decode.DecodeVarLenUint8(br) + 1;
		s.context_index = 0;
		context_map[0] = FunctionMalloc.mallocUInt(context_map_size);
		if(context_map[0].length == 0) {
			return 0;
		}
		if(num_htrees[0] <= 1) {
			DefaultFunctions.memset_UInt(context_map[0],0,0,context_map_size);
			return 1;
		}
		use_rle_for_zeros = decode_BitReader.BrotliReadBits(br,1);
		if(use_rle_for_zeros == 1) {
			s.max_run_length_prefix = decode_BitReader.BrotliReadBits(br,4) + 1;
		} else {
			s.max_run_length_prefix = 0;
		}
		s.context_map_table = FunctionMalloc.malloc2_decode_huffman_HuffmanCode(decode_huffman_HuffmanCode,1080);
		if(s.context_map_table == null) {
			return 0;
		}
		s.sub_state[0] = 80;
	}
	if(s.sub_state[0] == 80) {
		result = decode_Decode.ReadHuffmanCode(num_htrees[0] + s.max_run_length_prefix,s.context_map_table,0,null,s);
		if(result != 1) {
			return result;
		}
		s.sub_state[0] = 81;
	}
	if(s.sub_state[0] == 81) {
		while(s.context_index < context_map_size) {
			var code;
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				return 2;
			}
			code = decode_Decode.ReadSymbol(s.context_map_table,0,br);
			if(code == 0) {
				context_map[0][s.context_index] = 0;
				++s.context_index;
			} else if(code <= s.max_run_length_prefix) {
				var reps = 1 + (1 << code) + decode_BitReader.BrotliReadBits(br,code);
				while(--reps > 0) {
					if(s.context_index >= context_map_size) {
						return 0;
					}
					context_map[0][s.context_index] = 0;
					++s.context_index;
				}
			} else {
				context_map[0][s.context_index] = code - s.max_run_length_prefix;
				++s.context_index;
			}
		}
		if(decode_BitReader.BrotliReadBits(br,1) == 1) {
			decode_Decode.InverseMoveToFrontTransform(context_map[0],context_map_size);
		}
		s.context_map_table = null;
		s.sub_state[0] = 50;
		return 1;
	}
	return 0;
};
decode_Decode.DecodeBlockType = function(max_block_type,trees,tree_type,block_types,ringbuffers,indexes,br) {
	var ringbuffer_off = tree_type * 2;
	var type_code = decode_Decode.ReadSymbol(trees,tree_type * 1080,br);
	var block_type;
	if(type_code == 0) {
		block_type = ringbuffers[ringbuffer_off + (indexes[tree_type] & 1)];
	} else if(type_code == 1) {
		block_type = ringbuffers[ringbuffer_off + (indexes[tree_type] - 1 & 1)] + 1;
	} else {
		block_type = type_code - 2;
	}
	if(block_type >= max_block_type) {
		block_type -= max_block_type;
	}
	block_types[tree_type] = block_type;
	ringbuffers[ringbuffer_off + (indexes[tree_type] & 1)] = block_type;
	indexes[tree_type] = indexes[tree_type] + 1;
};
decode_Decode.DecodeBlockTypeWithContext = function(s,br) {
	decode_Decode.DecodeBlockType(s.num_block_types[0],s.block_type_trees,0,s.block_type,s.block_type_rb,s.block_type_rb_index,br);
	s.block_length[0] = decode_Decode.ReadBlockLength(s.block_len_trees,0,br);
	s.context_offset = s.block_type[0] << 6;
	s.context_map_slice = s.context_map;
	s.context_map_slice_off = s.context_map_off + s.context_offset;
	s.literal_htree_index = s.context_map_slice[s.context_map_slice_off];
	s.context_mode = s.context_modes[s.block_type[0]];
	s.context_lookup_offset1 = decode_Context.kContextLookupOffsets[s.context_mode];
	s.context_lookup_offset2 = decode_Context.kContextLookupOffsets[s.context_mode + 1];
};
decode_Decode.CopyUncompressedBlockToOutput = function(output,pos,s) {
	var rb_size = s.ringbuffer_mask + 1;
	var ringbuffer_end = s.ringbuffer;
	var ringbuffer_end_off = s.ringbuffer_off + rb_size;
	var rb_pos = pos & s.ringbuffer_mask;
	var br_pos = s.br.pos_ & 8191;
	var remaining_bits;
	var num_read;
	var num_written;
	while(true) {
		if(s.sub_state[0] == 50) {
			if(s.meta_block_remaining_len < 8 || _$UInt_UInt_$Impl_$.gt(s.br.bit_end_pos_,s.br.bit_pos_ + (s.meta_block_remaining_len << 3))) {
				s.sub_state[0] = 51;
				continue;
			}
			if(_$UInt_UInt_$Impl_$.gt(64,s.br.bit_end_pos_)) {
				return 0;
			}
			remaining_bits = 32;
			while(_$UInt_UInt_$Impl_$.gt(remaining_bits,s.br.bit_pos_)) {
				s.ringbuffer[s.ringbuffer_off + rb_pos] = s.br.val_ >>> s.br.bit_pos_ & 255;
				s.br.bit_pos_ = s.br.bit_pos_ + 8;
				++rb_pos;
				--s.meta_block_remaining_len;
			}
			s.nbytes = s.br.bit_end_pos_ - s.br.bit_pos_ >>> 3;
			if(br_pos + s.nbytes > 8191) {
				var tail = 8192 - br_pos;
				DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off + rb_pos,s.br.buf_,s.br.buf_off + br_pos,tail);
				s.nbytes -= tail;
				rb_pos += tail;
				s.meta_block_remaining_len -= tail;
				br_pos = 0;
			}
			DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off + rb_pos,s.br.buf_,s.br.buf_off + br_pos,s.nbytes);
			rb_pos += s.nbytes;
			s.meta_block_remaining_len -= s.nbytes;
			s.partially_written = 0;
			s.sub_state[0] = 55;
		}
		if(s.sub_state[0] == 55) {
			if(rb_pos >= rb_size) {
				num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off + s.partially_written,rb_size - s.partially_written);
				if(num_written < 0) {
					return 0;
				}
				s.partially_written += num_written;
				if(s.partially_written < rb_size) {
					return 3;
				}
				rb_pos -= rb_size;
				s.meta_block_remaining_len += rb_size;
				DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off,ringbuffer_end,ringbuffer_end_off,rb_pos);
			}
			s.sub_state[0] = 52;
			continue;
		}
		if(s.sub_state[0] == 51) {
			while(s.meta_block_remaining_len > 0) {
				if(!decode_BitReader.BrotliReadMoreInput(s.br)) {
					return 2;
				}
				s.ringbuffer[rb_pos++] = decode_BitReader.BrotliReadBits(s.br,8);
				if(rb_pos == rb_size) {
					s.partially_written = 0;
					s.sub_state[0] = 56;
					break;
				}
				s.meta_block_remaining_len--;
			}
			if(s.sub_state[0] == 51) {
				s.sub_state[0] = 50;
				return 1;
			}
			s.sub_state[0] = 56;
		}
		if(s.sub_state[0] == 56) {
			num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off + s.partially_written,rb_size - s.partially_written);
			if(num_written < 0) {
				return 0;
			}
			s.partially_written += num_written;
			if(s.partially_written < rb_size) {
				return 3;
			}
			rb_pos = 0;
			s.meta_block_remaining_len--;
			s.sub_state[0] = 51;
			continue;
		}
		if(s.sub_state[0] == 52) {
			if(rb_pos + s.meta_block_remaining_len >= rb_size) {
				s.nbytes = rb_size - rb_pos;
				if(decode_Streams.BrotliRead(s.br.input_,s.ringbuffer,s.ringbuffer_off + rb_pos,s.nbytes) < s.nbytes) {
					return 2;
				}
				s.partially_written = 0;
				s.sub_state[0] = 57;
			} else {
				s.sub_state[0] = 53;
				continue;
			}
		}
		if(s.sub_state[0] == 57) {
			num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off + s.partially_written,rb_size - s.partially_written);
			if(num_written < 0) {
				return 0;
			}
			s.partially_written += num_written;
			if(s.partially_written < rb_size) {
				return 3;
			}
			s.meta_block_remaining_len -= s.nbytes;
			rb_pos = 0;
			s.sub_state[0] = 52;
			continue;
		}
		if(s.sub_state[0] == 53) {
			num_read = decode_Streams.BrotliRead(s.br.input_,s.ringbuffer,s.ringbuffer_off + rb_pos,s.meta_block_remaining_len);
			s.meta_block_remaining_len -= num_read;
			if(s.meta_block_remaining_len > 0) {
				return 2;
			}
			decode_BitReader.BrotliInitBitReader(s.br,s.br.input_,s.br.finish_);
			s.sub_state[0] = 54;
		}
		if(s.sub_state[0] == 54) {
			if(!decode_BitReader.BrotliWarmupBitReader(s.br)) {
				return 2;
			}
			s.sub_state[0] = 50;
			return 1;
		}
	}
};
decode_Decode.BrotliDecompressedSize = function(encoded_size,encoded_buffer,encoded_buffer_off,decoded_size) {
	var val = 0;
	var bit_pos = 0;
	var is_last;
	var is_uncompressed = 0;
	var size_nibbles;
	var meta_block_len = 0;
	if(encoded_size == 0) {
		return 0;
	}
	var _g = 0;
	while(_g < 4) {
		var i = _g++;
		if(i >= encoded_size) {
			break;
		}
		val = val | encoded_buffer[i] << 8 * i;
	}
	bit_pos = 1;
	if((val & 1) == 1) {
		bit_pos = 4;
		if((val >>> 1 & 7) == 0) {
			bit_pos = 7;
		}
	}
	is_last = val >>> bit_pos & 1;
	++bit_pos;
	if(is_last == 1) {
		if((val >>> bit_pos & 1) == 1) {
			decoded_size[0] = 0;
			return 1;
		}
		++bit_pos;
	}
	size_nibbles = (val >>> bit_pos & 3) + 4;
	if(size_nibbles == 7) {
		return 0;
	}
	bit_pos += 2;
	var _g1 = 0;
	while(_g1 < size_nibbles) {
		meta_block_len = meta_block_len | (val >>> bit_pos & 15) << 4 * _g1++;
		bit_pos += 4;
	}
	++meta_block_len;
	if(is_last == 1) {
		decoded_size[0] = meta_block_len;
		return 1;
	}
	is_uncompressed = val >>> bit_pos & 1;
	++bit_pos;
	if(is_uncompressed == 1) {
		var offset = (bit_pos + 7 >> 3) + meta_block_len;
		if(offset < encoded_size && (encoded_buffer[offset] & 3) == 3) {
			decoded_size[0] = meta_block_len;
			return 1;
		}
	}
	return 0;
};
decode_Decode.BrotliDecompressStreaming = function(input,output,finish,s) {
	var context;
	var pos = s.pos;
	var i = s.loop_counter;
	var result = 1;
	var br = s.br;
	var initial_remaining_len;
	var bytes_copied;
	var num_written;
	var kRingBufferWriteAheadSlack = 4224;
	s.br.input_ = input;
	s.br.finish_ = finish;
	while(true) {
		if(result != 1) {
			if(result == 2 && finish == 1) {
				console.log("Unexpected end of input. State: " + s.state + "\n");
				result = 0;
			}
			break;
		}
		if(s.state == 0) {
			pos = 0;
			s.input_end = 0;
			s.window_bits = 0;
			s.max_distance = 0;
			s.dist_rb[0] = 16;
			s.dist_rb[1] = 15;
			s.dist_rb[2] = 11;
			s.dist_rb[3] = 4;
			s.dist_rb_idx = 0;
			s.prev_byte1 = 0;
			s.prev_byte2 = 0;
			s.block_type_trees = null;
			s.block_len_trees = null;
			decode_BitReader.BrotliInitBitReader(br,input,finish);
			s.state = 1;
		}
		if(s.state == 1) {
			if(!decode_BitReader.BrotliWarmupBitReader(br)) {
				result = 2;
				continue;
			}
			s.window_bits = decode_Decode.DecodeWindowBits(br);
			if(s.window_bits == 9) {
				result = 0;
				continue;
			}
			s.max_backward_distance = (1 << s.window_bits) - 16;
			s.block_type_trees = FunctionMalloc.malloc2_decode_huffman_HuffmanCode(decode_huffman_HuffmanCode,3240);
			s.block_len_trees = FunctionMalloc.malloc2_decode_huffman_HuffmanCode(decode_huffman_HuffmanCode,3240);
			if(s.block_type_trees == null || s.block_len_trees == null) {
				result = 0;
				continue;
			}
			s.state = 10;
		}
		if(s.state == 10) {
			if(s.input_end != 0) {
				s.partially_written = 0;
				s.state = 100;
				continue;
			}
			s.meta_block_remaining_len = 0;
			s.block_length[0] = 268435456;
			s.block_length[1] = 268435456;
			s.block_length[2] = 268435456;
			s.block_type[0] = 0;
			s.num_block_types[0] = 1;
			s.num_block_types[1] = 1;
			s.num_block_types[2] = 1;
			s.block_type_rb[0] = 0;
			s.block_type_rb[1] = 1;
			s.block_type_rb[2] = 0;
			s.block_type_rb[3] = 1;
			s.block_type_rb[4] = 0;
			s.block_type_rb[5] = 1;
			s.block_type_rb_index[0] = 0;
			s.context_map = null;
			s.context_modes = null;
			s.dist_context_map = null;
			s.context_offset = 0;
			s.context_map_slice = null;
			s.context_map_slice_off = 0;
			s.literal_htree_index = 0;
			s.dist_context_offset = 0;
			s.dist_context_map_slice = null;
			s.dist_context_map_slice_off = 0;
			s.dist_htree_index = 0;
			s.context_lookup_offset1 = 0;
			s.context_lookup_offset2 = 0;
			var _g = 0;
			while(_g < 3) {
				var i1 = _g++;
				s.hgroup[i1].codes = null;
				s.hgroup[i1].htrees = null;
			}
			s.state = 11;
		}
		if(s.state == 11) {
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				result = 2;
				continue;
			}
			var meta_block_remaining_len = [s.meta_block_remaining_len];
			var input_end = [s.input_end];
			var is_metadata = [s.is_metadata];
			var is_uncompressed = [s.is_uncompressed];
			if(!decode_Decode.DecodeMetaBlockLength(br,meta_block_remaining_len,input_end,is_metadata,is_uncompressed)) {
				result = 0;
				continue;
			}
			s.meta_block_remaining_len = meta_block_remaining_len[0];
			s.input_end = input_end[0];
			s.is_metadata = is_metadata[0];
			s.is_uncompressed = is_uncompressed[0];
			if(s.ringbuffer == null) {
				var known_size = [0];
				s.ringbuffer_size = 1 << s.window_bits;
				if(decode_Decode.BrotliDecompressedSize(4096,br.buf_,br.buf_off,known_size) == 1) {
					while(s.ringbuffer_size >= known_size[0] * 2 && s.ringbuffer_size > 1) s.ringbuffer_size = s.ringbuffer_size / 2 | 0;
				}
				while(s.ringbuffer_size < s.custom_dict_size) s.ringbuffer_size *= 2;
				s.ringbuffer_mask = s.ringbuffer_size - 1;
				var length = s.ringbuffer_size + kRingBufferWriteAheadSlack + 24;
				s.ringbuffer = new Array(length);
				s.ringbuffer_off = 0;
				if(s.ringbuffer.length == 0) {
					result = 0;
					continue;
				}
				s.ringbuffer_end = s.ringbuffer;
				s.ringbuffer_end_off = s.ringbuffer_off + s.ringbuffer_size;
				if(s.custom_dict_off != -1) {
					DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off + (-s.custom_dict_size & s.ringbuffer_mask),s.custom_dict,s.custom_dict_off,s.custom_dict_size);
					if(s.custom_dict_size > 0) {
						s.prev_byte1 = s.custom_dict[s.custom_dict_size - 1];
					}
					if(s.custom_dict_size > 1) {
						s.prev_byte2 = s.custom_dict[s.custom_dict_size - 2];
					}
				}
			}
			if(s.is_metadata == 1) {
				if(!decode_Decode.JumpToByteBoundary(s.br)) {
					result = 0;
					continue;
				}
				s.state = 18;
				continue;
			}
			if(s.meta_block_remaining_len == 0) {
				s.state = 20;
				continue;
			}
			if(s.is_uncompressed == 1) {
				if(!decode_Decode.JumpToByteBoundary(s.br)) {
					result = 0;
					continue;
				}
				s.state = 17;
				continue;
			}
			i = 0;
			s.state = 30;
			continue;
		}
		if(s.state == 17) {
			initial_remaining_len = s.meta_block_remaining_len;
			result = decode_Decode.CopyUncompressedBlockToOutput(output,pos,s);
			if(result == 3) {
				continue;
			}
			bytes_copied = initial_remaining_len - s.meta_block_remaining_len;
			pos += bytes_copied;
			if(bytes_copied > 0) {
				s.prev_byte2 = bytes_copied == 1 ? s.prev_byte1 : s.ringbuffer[pos - 2 & s.ringbuffer_mask];
				s.prev_byte1 = s.ringbuffer[pos - 1 & s.ringbuffer_mask];
			}
			if(result != 1) {
				continue;
			}
			s.state = 20;
			continue;
		}
		if(s.state == 18) {
			while(s.meta_block_remaining_len > 0) {
				if(!decode_BitReader.BrotliReadMoreInput(s.br)) {
					result = 2;
					continue;
				}
				decode_BitReader.BrotliReadBits(s.br,8);
				--s.meta_block_remaining_len;
			}
			s.state = 20;
			continue;
		}
		if(s.state == 30) {
			if(i >= 3) {
				s.state = 12;
				continue;
			}
			s.num_block_types[i] = decode_Decode.DecodeVarLenUint8(br) + 1;
			s.state = 31;
		}
		if(s.state == 31) {
			if(s.num_block_types[i] >= 2) {
				result = decode_Decode.ReadHuffmanCode(s.num_block_types[i] + 2,s.block_type_trees,i * 1080,null,s);
				if(result != 1) {
					continue;
				}
				s.state = 32;
			} else {
				++i;
				s.state = 30;
				continue;
			}
		}
		if(s.state == 32) {
			result = decode_Decode.ReadHuffmanCode(26,s.block_len_trees,i * 1080,null,s);
			if(result != 1) {
				break;
			}
			s.block_length[i] = decode_Decode.ReadBlockLength(s.block_len_trees,i * 1080,br);
			s.block_type_rb_index[i] = 1;
			++i;
			s.state = 30;
			continue;
		}
		if(s.state == 12) {
			if(!decode_BitReader.BrotliReadInputAmount(br,128)) {
				result = 2;
				continue;
			}
			s.distance_postfix_bits = decode_BitReader.BrotliReadBits(br,2);
			s.num_direct_distance_codes = 16 + (decode_BitReader.BrotliReadBits(br,4) << s.distance_postfix_bits);
			s.distance_postfix_mask = (1 << s.distance_postfix_bits) - 1;
			s.num_distance_codes = s.num_direct_distance_codes + (48 << s.distance_postfix_bits);
			s.context_modes = FunctionMalloc.mallocUInt(s.num_block_types[0]);
			if(s.context_modes.length == 0) {
				result = 0;
				continue;
			}
			var _g1 = 0;
			var _g2 = s.num_block_types[0];
			while(_g1 < _g2) s.context_modes[_g1++] = decode_BitReader.BrotliReadBits(br,2) << 1;
			s.state = 33;
		}
		if(s.state == 33) {
			var num_literal_htrees = [s.num_literal_htrees];
			var context_map = [s.context_map];
			result = decode_Decode.DecodeContextMap(s.num_block_types[0] << 6,num_literal_htrees,context_map,s);
			s.num_literal_htrees = num_literal_htrees[0];
			s.context_map = context_map[0];
			s.context_map_off = 0;
			s.trivial_literal_context = 1;
			var _g11 = 0;
			var _g3 = s.num_block_types[0] << 6;
			while(_g11 < _g3) {
				var i2 = _g11++;
				if(s.context_map[i2] != i2 >> 6) {
					s.trivial_literal_context = 0;
					continue;
				}
			}
			if(result != 1) {
				continue;
			}
			s.state = 34;
		}
		if(s.state == 34) {
			var num_dist_htrees = [s.num_dist_htrees];
			var dist_context_map = [s.dist_context_map];
			result = decode_Decode.DecodeContextMap(s.num_block_types[2] << 2,num_dist_htrees,dist_context_map,s);
			s.num_dist_htrees = num_dist_htrees[0];
			s.dist_context_map = dist_context_map[0];
			s.dist_context_map_off = 0;
			if(result != 1) {
				continue;
			}
			decode_Huffman.BrotliHuffmanTreeGroupInit(s.hgroup[0],256,s.num_literal_htrees);
			decode_Huffman.BrotliHuffmanTreeGroupInit(s.hgroup[1],704,s.num_block_types[1]);
			decode_Huffman.BrotliHuffmanTreeGroupInit(s.hgroup[2],s.num_distance_codes,s.num_dist_htrees);
			i = 0;
			s.state = 35;
		}
		if(s.state == 35) {
			result = decode_Decode.HuffmanTreeGroupDecode(s.hgroup[i],s);
			if(result != 1) {
				continue;
			}
			++i;
			if(i >= 3) {
				s.context_map_slice = s.context_map;
				s.context_map_slice_off = s.context_map_off;
				s.dist_context_map_slice = s.dist_context_map;
				s.dist_context_map_slice_off = s.dist_context_map_off;
				s.context_mode = s.context_modes[s.block_type[0]];
				s.context_lookup_offset1 = decode_Context.kContextLookupOffsets[s.context_mode];
				s.context_lookup_offset2 = decode_Context.kContextLookupOffsets[s.context_mode + 1];
				s.htree_command = s.hgroup[1].htrees[0];
				s.htree_command_off = s.hgroup[1].htrees_off[0];
				s.state = 13;
				continue;
			}
			continue;
		}
		if(s.state == 13) {
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				result = 2;
				continue;
			}
			if(s.meta_block_remaining_len <= 0) {
				pos &= 1073741823;
				s.state = 20;
				continue;
			}
			if(s.block_length[1] == 0) {
				decode_Decode.DecodeBlockType(s.num_block_types[1],s.block_type_trees,1,s.block_type,s.block_type_rb,s.block_type_rb_index,br);
				s.block_length[1] = decode_Decode.ReadBlockLength(s.block_len_trees,1080,br);
				s.htree_command = s.hgroup[1].htrees[s.block_type[1]];
				s.htree_command_off = s.hgroup[1].htrees_off[s.block_type[1]];
			}
			s.block_length[1] -= 1;
			s.cmd_code = decode_Decode.ReadSymbol(s.htree_command,s.htree_command_off,br);
			s.range_idx = s.cmd_code >> 6;
			if(s.range_idx >= 2) {
				s.range_idx -= 2;
				s.distance_code = -1;
			} else {
				s.distance_code = 0;
			}
			s.insert_code = decode_Prefix.kInsertRangeLut[s.range_idx] + (s.cmd_code >> 3 & 7);
			s.copy_code = decode_Prefix.kCopyRangeLut[s.range_idx] + (s.cmd_code & 7);
			s.insert_length = decode_Prefix.kInsertLengthPrefixCode[s.insert_code].offset + decode_BitReader.BrotliReadBits(br,decode_Prefix.kInsertLengthPrefixCode[s.insert_code].nbits);
			s.copy_length = decode_Prefix.kCopyLengthPrefixCode[s.copy_code].offset + decode_BitReader.BrotliReadBits(br,decode_Prefix.kCopyLengthPrefixCode[s.copy_code].nbits);
			i = 0;
			s.state = 14;
		}
		if(s.state == 14) {
			if(s.trivial_literal_context == 1) {
				while(i < s.insert_length) {
					if(!decode_BitReader.BrotliReadMoreInput(br)) {
						result = 2;
						break;
					}
					if(s.block_length[0] == 0) {
						decode_Decode.DecodeBlockTypeWithContext(s,br);
					}
					s.ringbuffer[pos & s.ringbuffer_mask] = decode_Decode.ReadSymbol(s.hgroup[0].htrees[s.literal_htree_index],s.hgroup[0].htrees_off[s.literal_htree_index],br);
					s.block_length[0] -= 1;
					if((pos & s.ringbuffer_mask) == s.ringbuffer_mask) {
						s.partially_written = 0;
						s.state = 19;
						break;
					}
					++pos;
					++i;
				}
			} else {
				var p1 = s.prev_byte1;
				var p2 = s.prev_byte2;
				while(i < s.insert_length) {
					if(!decode_BitReader.BrotliReadMoreInput(br)) {
						result = 2;
						break;
					}
					if(s.block_length[0] == 0) {
						decode_Decode.DecodeBlockTypeWithContext(s,br);
					}
					context = decode_Context.kContextLookup[s.context_lookup_offset1 + p1] | decode_Context.kContextLookup[s.context_lookup_offset2 + p2];
					s.literal_htree_index = s.context_map_slice[s.context_map_slice_off + context];
					s.block_length[0] -= 1;
					p2 = p1;
					p1 = decode_Decode.ReadSymbol(s.hgroup[0].htrees[s.literal_htree_index],s.hgroup[0].htrees_off[s.literal_htree_index],br);
					s.ringbuffer[pos & s.ringbuffer_mask] = p1;
					if((pos & s.ringbuffer_mask) == s.ringbuffer_mask) {
						s.partially_written = 0;
						s.state = 19;
						break;
					}
					++pos;
					++i;
				}
				s.prev_byte1 = p1;
				s.prev_byte2 = p2;
			}
			if(result != 1 || s.state == 19) {
				continue;
			}
			s.meta_block_remaining_len -= s.insert_length;
			if(s.meta_block_remaining_len <= 0) {
				s.state = 20;
				continue;
			} else if(s.distance_code < 0) {
				s.state = 15;
			} else {
				s.state = 16;
				continue;
			}
		}
		if(s.state == 15) {
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				result = 2;
				continue;
			}
			if(s.block_length[2] == 0) {
				decode_Decode.DecodeBlockType(s.num_block_types[2],s.block_type_trees,2,s.block_type,s.block_type_rb,s.block_type_rb_index,br);
				s.block_length[2] = decode_Decode.ReadBlockLength(s.block_len_trees,2160,br);
				s.dist_context_offset = s.block_type[2] << 2;
				s.dist_context_map_slice = s.dist_context_map;
				s.dist_context_map_slice_off = s.dist_context_map_off + s.dist_context_offset;
			}
			s.block_length[2] -= 1;
			if(s.copy_length > 4) {
				context = 3;
			} else {
				context = s.copy_length - 2;
			}
			s.dist_htree_index = s.dist_context_map_slice[s.dist_context_map_slice_off + context];
			s.distance_code = decode_Decode.ReadSymbol(s.hgroup[2].htrees[s.dist_htree_index],s.hgroup[2].htrees_off[s.dist_htree_index],br);
			if(s.distance_code >= s.num_direct_distance_codes) {
				var nbits;
				var postfix;
				var offset;
				s.distance_code -= s.num_direct_distance_codes;
				postfix = s.distance_code & s.distance_postfix_mask;
				s.distance_code >>= s.distance_postfix_bits;
				nbits = (s.distance_code >> 1) + 1;
				offset = (2 + (s.distance_code & 1) << nbits) - 4;
				s.distance_code = s.num_direct_distance_codes + (offset + decode_BitReader.BrotliReadBits(br,nbits) << s.distance_postfix_bits) + postfix;
			}
			s.state = 16;
		}
		if(s.state == 16) {
			if(!decode_BitReader.BrotliReadMoreInput(br)) {
				result = 2;
				continue;
			}
			s.distance = decode_Decode.TranslateShortCodes(s.distance_code,s.dist_rb,s.dist_rb_idx);
			if(s.distance < 0) {
				result = 0;
				continue;
			}
			if(pos + s.custom_dict_size < s.max_backward_distance && s.max_distance != s.max_backward_distance) {
				s.max_distance = pos + s.custom_dict_size;
			} else {
				s.max_distance = s.max_backward_distance;
			}
			s.copy_dst = s.ringbuffer;
			s.copy_dst_off = s.ringbuffer_off + (pos & s.ringbuffer_mask);
			if(s.distance > s.max_distance) {
				if(s.copy_length >= 4 && s.copy_length <= 24) {
					var offset1 = decode_Dictionary.kBrotliDictionaryOffsetsByLength[s.copy_length];
					var word_id = s.distance - s.max_distance - 1;
					var shift = decode_Dictionary.kBrotliDictionarySizeBitsByLength[s.copy_length];
					var transform_idx = word_id >> shift;
					offset1 += (word_id & (1 << shift) - 1) * s.copy_length;
					if(transform_idx < decode_Transforms.kNumTransforms) {
						var len = decode_Transforms.TransformDictionaryWord(s.copy_dst,s.copy_dst_off,decode_Dictionary.kBrotliDictionary,offset1,s.copy_length,transform_idx);
						s.copy_dst_off += len;
						pos += len;
						s.meta_block_remaining_len -= len;
						if(s.copy_dst_off >= s.ringbuffer_end_off) {
							s.partially_written = 0;
							num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off,s.ringbuffer_size);
							if(num_written < 0) {
								result = 0;
								continue;
							}
							s.partially_written += num_written;
							if(s.partially_written < s.ringbuffer_size) {
								result = 3;
								s.state = 21;
								continue;
							}
							DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off,s.ringbuffer_end,s.ringbuffer_end_off,s.copy_dst_off - s.ringbuffer_end_off);
						}
					} else {
						console.log("Invalid backward reference. pos: " + pos + " distance: " + s.distance + " " + "len: " + s.copy_length + " bytes left: " + s.meta_block_remaining_len + "\n");
						result = 0;
						continue;
					}
				} else {
					console.log("Invalid backward reference. pos: " + pos + " distance: " + s.distance + " " + "len: " + s.copy_length + " bytes left: " + s.meta_block_remaining_len + "\n");
					result = 0;
					continue;
				}
			} else {
				if(s.distance_code > 0) {
					s.dist_rb[s.dist_rb_idx & 3] = s.distance;
					++s.dist_rb_idx;
				}
				if(s.copy_length > s.meta_block_remaining_len) {
					console.log("Invalid backward reference. pos: " + pos + " distance: " + s.distance + " " + "len: " + s.copy_length + " bytes left: " + s.meta_block_remaining_len + "\n");
					result = 0;
					continue;
				}
				s.copy_src = s.ringbuffer;
				s.copy_src_off = s.ringbuffer_off + (pos - s.distance & s.ringbuffer_mask);
				var _g12 = 0;
				var _g4 = s.copy_length;
				while(_g12 < _g4) {
					_g12++;
					s.ringbuffer[pos & s.ringbuffer_mask] = s.ringbuffer[pos - s.distance & s.ringbuffer_mask];
					if((pos & s.ringbuffer_mask) == s.ringbuffer_mask) {
						s.partially_written = 0;
						num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off,s.ringbuffer_size);
						if(num_written < 0) {
							result = 0;
							continue;
						}
						s.partially_written += num_written;
						if(s.partially_written < s.ringbuffer_size) {
							result = 3;
							s.state = 22;
							continue;
						}
					}
					++pos;
					--s.meta_block_remaining_len;
				}
				if(result == 3) {
					continue;
				}
			}
			s.state = 23;
		}
		if(s.state == 23) {
			s.prev_byte1 = s.ringbuffer[pos - 1 & s.ringbuffer_mask];
			s.prev_byte2 = s.ringbuffer[pos - 2 & s.ringbuffer_mask];
			s.state = 13;
		}
		if(s.state == 19 || s.state == 21 || s.state == 22) {
			num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off + s.partially_written,s.ringbuffer_size - s.partially_written);
			if(num_written < 0) {
				result = 0;
				continue;
			}
			s.partially_written += num_written;
			if(s.partially_written < s.ringbuffer_size) {
				result = 3;
				continue;
			}
			if(s.state == 21) {
				DefaultFunctions.memcpy_UInt(s.ringbuffer,s.ringbuffer_off,s.ringbuffer_end,s.ringbuffer_end_off,s.copy_dst_off - s.ringbuffer_end_off);
				s.state = 23;
			} else if(s.state == 22) {
				++pos;
				--s.meta_block_remaining_len;
				++i;
				while(i < s.copy_length) {
					s.ringbuffer[pos & s.ringbuffer_mask] = s.ringbuffer[pos - s.distance & s.ringbuffer_mask];
					if((pos & s.ringbuffer_mask) == s.ringbuffer_mask) {
						s.partially_written = 0;
						num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off,s.ringbuffer_size);
						if(num_written < 0) {
							result = 0;
							continue;
						}
						s.partially_written += num_written;
						if(s.partially_written < s.ringbuffer_size) {
							result = 3;
							continue;
						}
					}
					++pos;
					--s.meta_block_remaining_len;
					++i;
				}
				if(result == 3) {
					continue;
				}
				s.state = 23;
			} else {
				++pos;
				++i;
				s.state = 14;
			}
			continue;
		}
		if(s.state == 20) {
			if(s.context_modes != null) {
				s.context_modes = null;
			}
			if(s.context_map != null) {
				s.context_map = null;
			}
			if(s.dist_context_map != null) {
				s.dist_context_map = null;
			}
			var _g5 = 0;
			while(_g5 < 3) {
				var i3 = _g5++;
				s.hgroup[i3].codes = null;
				s.hgroup[i3].htrees = null;
			}
			s.state = 10;
			continue;
		}
		if(s.state == 100) {
			if(s.ringbuffer.length != 0) {
				num_written = decode_Streams.BrotliWrite(output,s.ringbuffer,s.ringbuffer_off + s.partially_written,(pos & s.ringbuffer_mask) - s.partially_written);
				if(num_written < 0) {
					return 0;
				}
				s.partially_written += num_written;
				if(s.partially_written < (pos & s.ringbuffer_mask)) {
					result = 3;
					break;
				}
			}
			if(!decode_Decode.JumpToByteBoundary(s.br)) {
				result = 0;
			}
			return result;
		}
	}
	s.pos = pos;
	s.loop_counter = i;
	return result;
};
decode_Decode.BrotliDecompress = function(input,output) {
	var s = new decode_state_BrotliState();
	decode_State.BrotliStateInit(s);
	decode_Decode.BrotliDecompressStreaming(input,output,1,s);
	return 1;
};
var Main = function() {
};
Main.__name__ = true;
Main.main = function() {
	return;
};
Main.__super__ = decode_Decode;
Main.prototype = $extend(decode_Decode.prototype,{
	__class__: Main
});
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var _$UInt_UInt_$Impl_$ = {};
_$UInt_UInt_$Impl_$.__name__ = true;
_$UInt_UInt_$Impl_$.gt = function(a,b) {
	var aNeg = a < 0;
	if(aNeg != b < 0) {
		return aNeg;
	} else {
		return a > b;
	}
};
_$UInt_UInt_$Impl_$.gte = function(a,b) {
	var aNeg = a < 0;
	if(aNeg != b < 0) {
		return aNeg;
	} else {
		return a >= b;
	}
};
_$UInt_UInt_$Impl_$.toFloat = function(this1) {
	if(this1 < 0) {
		return 4294967296.0 + this1;
	} else {
		return this1 + 0.0;
	}
};
var decode_BitReader = function() {
};
decode_BitReader.__name__ = true;
decode_BitReader.BitMask = function(n) {
	return decode_BitReader.kBitMask[n];
};
decode_BitReader.ShiftBytes32 = function(br) {
	while(_$UInt_UInt_$Impl_$.gte(br.bit_pos_,8)) {
		br.val_ = br.val_ >>> 8;
		br.val_ = br.val_ | br.buf_[br.pos_ & 8191] * (Math.pow(2,24) | 0);
		++br.pos_;
		br.bit_pos_ = br.bit_pos_ - 8;
		br.bit_end_pos_ = br.bit_end_pos_ - 8;
	}
};
decode_BitReader.BrotliReadMoreInput = function(br) {
	if(_$UInt_UInt_$Impl_$.gt(br.bit_end_pos_,256)) {
		return true;
	} else if(br.eos_ > 0) {
		return _$UInt_UInt_$Impl_$.gte(br.bit_end_pos_,br.bit_pos_);
	} else {
		var dst = br.buf_ptr_;
		var dst_off = br.buf_ptr_off;
		var bytes_read = decode_Streams.BrotliRead(br.input_,dst,dst_off + br.tmp_bytes_read_,4096 - br.tmp_bytes_read_);
		if(bytes_read < 0) {
			return false;
		}
		bytes_read += br.tmp_bytes_read_;
		br.tmp_bytes_read_ = 0;
		if(bytes_read < 4096) {
			if(br.finish_ <= 0) {
				br.tmp_bytes_read_ = bytes_read;
				return false;
			}
			br.eos_ = 1;
			DefaultFunctions.memset_UInt(dst,dst_off + bytes_read,0,32);
		}
		if(dst_off == br.buf_off) {
			DefaultFunctions.memcpy_UInt(br.buf_,br.buf_off + 8192,br.buf_,br.buf_off,32);
			br.buf_ptr_ = br.buf_;
			br.buf_ptr_off = br.buf_off + 4096;
		} else {
			br.buf_ptr_ = br.buf_;
			br.buf_ptr_off = br.buf_off;
		}
		br.bit_end_pos_ = br.bit_end_pos_ + (bytes_read << 3);
		return true;
	}
};
decode_BitReader.BrotliReadInputAmount = function(br,num) {
	if(_$UInt_UInt_$Impl_$.gt(br.bit_end_pos_,num << 3)) {
		return true;
	} else if(br.eos_ > 0) {
		return _$UInt_UInt_$Impl_$.gte(br.bit_end_pos_,br.bit_pos_);
	} else {
		var dst = br.buf_ptr_;
		var dst_off = br.buf_ptr_off;
		var bytes_read = decode_Streams.BrotliRead(br.input_,dst,dst_off + br.tmp_bytes_read_,4096 - br.tmp_bytes_read_);
		if(bytes_read < 0) {
			return false;
		}
		bytes_read += br.tmp_bytes_read_;
		br.tmp_bytes_read_ = 0;
		if(bytes_read < 4096) {
			if(br.finish_ <= 0) {
				br.tmp_bytes_read_ = bytes_read;
				return false;
			}
			br.eos_ = 1;
			DefaultFunctions.memset_UInt(dst,dst_off + bytes_read,0,num);
		}
		if(dst_off == br.buf_off) {
			DefaultFunctions.memcpy_UInt(br.buf_,br.buf_off + 8192,br.buf_,br.buf_off,num);
			br.buf_ptr_ = br.buf_;
			br.buf_ptr_off = br.buf_off + 4096;
		} else {
			br.buf_ptr_ = br.buf_;
			br.buf_ptr_off = br.buf_off;
		}
		br.bit_end_pos_ = br.bit_end_pos_ + (bytes_read << 3);
		return true;
	}
};
decode_BitReader.BrotliFillBitWindow = function(br) {
	decode_BitReader.ShiftBytes32(br);
};
decode_BitReader.BrotliInitBitReader = function(br,input,finish) {
	br.finish_ = finish;
	br.tmp_bytes_read_ = 0;
	br.buf_ptr_ = br.buf_;
	br.buf_ptr_off = br.buf_off;
	br.input_ = input;
	br.val_ = 0;
	br.pos_ = 0;
	br.bit_pos_ = 0;
	br.bit_end_pos_ = 0;
	br.eos_ = 0;
};
decode_BitReader.BrotliWarmupBitReader = function(br) {
	if(!decode_BitReader.BrotliReadMoreInput(br)) {
		return false;
	}
	var _g = 0;
	while(_g < 4) {
		br.val_ = br.val_ | br.buf_[br.pos_] << 8 * _g++;
		++br.pos_;
	}
	return _$UInt_UInt_$Impl_$.gt(br.bit_end_pos_,0);
};
decode_BitReader.BrotliReadBits = function(br,n_bits) {
	var val;
	if(_$UInt_UInt_$Impl_$.gt(n_bits,32 - br.bit_pos_)) {
		decode_BitReader.BrotliFillBitWindow(br);
	}
	val = br.val_ >>> br.bit_pos_ & decode_BitReader.BitMask(n_bits);
	br.bit_pos_ = br.bit_pos_ + n_bits;
	return val;
};
decode_BitReader.prototype = {
	__class__: decode_BitReader
};
var decode_Context = function() {
};
decode_Context.__name__ = true;
decode_Context.prototype = {
	__class__: decode_Context
};
var decode_Dictionary = function() {
};
decode_Dictionary.__name__ = true;
decode_Dictionary.prototype = {
	__class__: decode_Dictionary
};
var decode_Huffman = function() {
};
decode_Huffman.__name__ = true;
decode_Huffman.GetNextKey = function(key,len) {
	var step = 1 << len - 1;
	while((key & step) > 0) step >>= 1;
	return (key & step - 1) + step;
};
decode_Huffman.ReplicateValue = function(table,table_off,step,end,code) {
	while(true) {
		end -= step;
		table[table_off + end] = new decode_huffman_HuffmanCode(code.bits,code.value);
		if(!(end > 0)) {
			break;
		}
	}
};
decode_Huffman.NextTableBitSize = function(count,len,root_bits) {
	var left = 1 << len - root_bits;
	while(len < 15) {
		left -= count[len];
		if(left <= 0) {
			break;
		}
		++len;
		left <<= 1;
	}
	return len - root_bits;
};
decode_Huffman.BrotliBuildHuffmanTable = function(root_table,root_table_off,root_bits,code_lengths,code_lengths_size) {
	var code = new decode_huffman_HuffmanCode(0,0);
	var table_off;
	var symbol;
	var key;
	var step;
	var low;
	var mask;
	var table_bits;
	var table_size;
	var total_size;
	var sorted = FunctionMalloc.mallocInt(704);
	var count = FunctionMalloc.mallocInt(16);
	var offset = FunctionMalloc.mallocInt(16);
	if(code_lengths_size > 704) {
		return 0;
	}
	var _g1 = 0;
	while(_g1 < code_lengths_size) {
		var _g2 = code_lengths[_g1++];
		count[_g2] = count[_g2] + 1;
	}
	offset[1] = 0;
	var _g = 1;
	while(_g < 15) {
		var len = _g++;
		offset[len + 1] = offset[len] + count[len];
	}
	var _g11 = 0;
	while(_g11 < code_lengths_size) {
		var symbol1 = _g11++;
		if(code_lengths[symbol1] != 0) {
			sorted[offset[code_lengths[symbol1]]] = symbol1;
			var _g21 = code_lengths[symbol1];
			offset[_g21] = offset[_g21] + 1;
		}
	}
	table_off = root_table_off;
	table_bits = root_bits;
	table_size = 1 << root_bits;
	total_size = table_size;
	if(offset[15] == 1) {
		code.bits = 0;
		code.value = sorted[0];
		var _g12 = 0;
		var _g3 = total_size;
		while(_g12 < _g3) root_table[root_table_off + _g12++] = code;
		return total_size;
	}
	key = 0;
	symbol = 0;
	step = 2;
	var _g13 = 1;
	var _g4 = root_bits + 1;
	while(_g13 < _g4) {
		var len1 = _g13++;
		while(count[len1] > 0) {
			code.bits = len1;
			code.value = sorted[symbol++];
			decode_Huffman.ReplicateValue(root_table,root_table_off + key,step,table_size,code);
			key = decode_Huffman.GetNextKey(key,len1);
			count[len1] = count[len1] - 1;
		}
		step <<= 1;
	}
	mask = total_size - 1;
	low = -1;
	step = 2;
	var _g14 = root_bits + 1;
	while(_g14 < 16) {
		var len2 = _g14++;
		while(count[len2] > 0) {
			if((key & mask) != low) {
				table_off += table_size;
				table_bits = decode_Huffman.NextTableBitSize(count,len2,root_bits);
				table_size = 1 << table_bits;
				total_size += table_size;
				low = key & mask;
				root_table[root_table_off + low].bits = table_bits + root_bits;
				root_table[root_table_off + low].value = table_off - root_table_off - low;
			}
			code.bits = len2 - root_bits;
			code.value = sorted[symbol++];
			decode_Huffman.ReplicateValue(root_table,table_off + (key >> root_bits),step,table_size,code);
			key = decode_Huffman.GetNextKey(key,len2);
			count[len2] = count[len2] - 1;
		}
		step <<= 1;
	}
	return total_size;
};
decode_Huffman.BrotliHuffmanTreeGroupInit = function(group,alphabet_size,ntrees) {
	group.alphabet_size = alphabet_size;
	group.num_htrees = ntrees;
	group.codes = FunctionMalloc.malloc2_decode_huffman_HuffmanCode(decode_huffman_HuffmanCode,ntrees * 1080);
	group.htrees = [];
	group.htrees_off = [];
};
decode_Huffman.BrotliHuffmanTreeGroupRelease = function(group) {
};
decode_Huffman.prototype = {
	__class__: decode_Huffman
};
var decode_Port = function() {
};
decode_Port.__name__ = true;
decode_Port.PREDICT_FALSE = function(x) {
	return x;
};
decode_Port.PREDICT_TRUE = function(x) {
	return x;
};
decode_Port.BROTLI_DCHECK = function(x) {
};
decode_Port.prototype = {
	__class__: decode_Port
};
var decode_prefix_PrefixCodeRange = function(offset,nbits) {
	this.offset = offset;
	this.nbits = nbits;
};
decode_prefix_PrefixCodeRange.__name__ = true;
decode_prefix_PrefixCodeRange.prototype = {
	__class__: decode_prefix_PrefixCodeRange
};
var decode_Prefix = function() {
};
decode_Prefix.__name__ = true;
decode_Prefix.prototype = {
	__class__: decode_Prefix
};
var decode_State = function() {
};
decode_State.__name__ = true;
decode_State.BrotliStateInit = function(s) {
	s.state = 0;
	s.sub_state[0] = 50;
	s.sub_state[1] = 50;
	s.block_type_trees = null;
	s.block_len_trees = null;
	s.ringbuffer = null;
	s.context_map = null;
	s.context_modes = null;
	s.dist_context_map = null;
	s.context_map_slice = null;
	s.context_map_slice_off = 0;
	s.dist_context_map_slice = null;
	s.dist_context_map_slice_off = 0;
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		s.hgroup[i].codes = null;
		s.hgroup[i].htrees = null;
	}
	s.code_lengths = null;
	s.context_map_table = null;
	s.custom_dict = null;
	s.custom_dict_size = 0;
};
decode_State.prototype = {
	__class__: decode_State
};
var decode_Streams = function() {
};
decode_Streams.__name__ = true;
decode_Streams.BrotliRead = function(input,buf,buf_off,len) {
	return input.cb_(input.data_,buf,buf_off,len);
};
decode_Streams.BrotliWrite = function(out,buf,buf_off,len) {
	return out.cb_(out.data_,buf,buf_off,len);
};
decode_Streams.BrotliMemInputFunction = function(data,buf,buf_off,count) {
	if(_$UInt_UInt_$Impl_$.gt(data.pos,data.length)) {
		return -1;
	}
	if(_$UInt_UInt_$Impl_$.gt(data.pos + count,data.length)) {
		count = data.length - data.pos;
	}
	DefaultFunctions.memcpyVectorArray(buf,buf_off,data.buffer,0 + data.pos,count);
	data.pos = data.pos + count;
	return count;
};
decode_Streams.BrotliInitMemInput = function(buffer,length) {
	var input = new decode_streams_BrotliInput();
	var mem_input = new decode_streams_BrotliMemInput();
	mem_input.buffer = buffer;
	mem_input.length = length;
	mem_input.pos = 0;
	input.cb_ = decode_Streams.BrotliMemInputFunction;
	input.data_ = mem_input;
	return input;
};
decode_Streams.BrotliMemOutputFunction = function(data,buf,buf_off,count) {
	DefaultFunctions.memcpyArrayVector(data.buffer,0 + data.pos,buf,buf_off,count);
	data.pos = data.pos + count;
	return count;
};
decode_Streams.BrotliInitMemOutput = function(buffer) {
	var output = new decode_streams_BrotliOutput();
	var mem_output = new decode_streams_BrotliMemOutput();
	mem_output.buffer = buffer;
	mem_output.pos = 0;
	output.cb_ = decode_Streams.BrotliMemOutputFunction;
	output.data_ = mem_output;
	return output;
};
decode_Streams.prototype = {
	__class__: decode_Streams
};
var decode_transform_Transform = function(prefix,transform,suffix) {
	this.prefix = [];
	var _g1 = 0;
	var _g = prefix.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.prefix[i] = HxOverrides.cca(prefix,i);
	}
	this.transform = transform;
	this.suffix = [];
	var _g11 = 0;
	var _g2 = suffix.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		this.suffix[i1] = HxOverrides.cca(suffix,i1);
	}
};
decode_transform_Transform.__name__ = true;
decode_transform_Transform.prototype = {
	__class__: decode_transform_Transform
};
var decode_Transforms = function() {
};
decode_Transforms.__name__ = true;
decode_Transforms.ToUpperCase = function(p,p_off) {
	if(_$UInt_UInt_$Impl_$.gt(192,p[p_off])) {
		var tmp;
		var tmp1 = HxOverrides.cca("a",0);
		if(_$UInt_UInt_$Impl_$.gte(p[p_off],tmp1)) {
			tmp = _$UInt_UInt_$Impl_$.gte(HxOverrides.cca("z",0),p[p_off]);
		} else {
			tmp = false;
		}
		if(tmp) {
			p[p_off] = p[p_off] ^ 32;
		}
		return 1;
	}
	if(_$UInt_UInt_$Impl_$.gt(224,p[p_off])) {
		var _g = p_off + 1;
		p[_g] = p[_g] ^ 32;
		return 2;
	}
	var _g1 = p_off + 2;
	p[_g1] = p[_g1] ^ 5;
	return 3;
};
decode_Transforms.TransformDictionaryWord = function(dst,dst_off,word,word_off,len,transform) {
	var prefix = decode_Transforms.kTransforms[transform].prefix;
	var suffix = decode_Transforms.kTransforms[transform].suffix;
	var t = decode_Transforms.kTransforms[transform].transform;
	var skip = t < decode_Transforms.kOmitFirst1 ? 0 : t - (decode_Transforms.kOmitFirst1 - 1);
	var idx = 0;
	var i = 0;
	var uppercase_off;
	if(skip > len) {
		skip = len;
	}
	var _g1 = 0;
	var _g = prefix.length;
	while(_g1 < _g) dst[dst_off + idx++] = prefix[_g1++];
	word_off += skip;
	len -= skip;
	if(t <= decode_Transforms.kOmitLast9) {
		len -= t;
	}
	while(i < len) dst[dst_off + idx++] = word[word_off + i++];
	uppercase_off = dst_off + (idx - len);
	if(t == decode_Transforms.kUppercaseFirst) {
		decode_Transforms.ToUpperCase(dst,uppercase_off);
	} else if(t == decode_Transforms.kUppercaseAll) {
		while(len > 0) {
			var step = decode_Transforms.ToUpperCase(dst,uppercase_off);
			uppercase_off += step;
			len -= step;
		}
	}
	var _g11 = 0;
	var _g2 = suffix.length;
	while(_g11 < _g2) dst[dst_off + idx++] = suffix[_g11++];
	return idx;
};
decode_Transforms.prototype = {
	__class__: decode_Transforms
};
var decode_bit_$reader_BrotliBitReader = function() {
	this.buf_off = 0;
	this.buf_ = new Array(8320);
};
decode_bit_$reader_BrotliBitReader.__name__ = true;
decode_bit_$reader_BrotliBitReader.prototype = {
	__class__: decode_bit_$reader_BrotliBitReader
};
var decode_huffman_HuffmanCode = function(bits,value) {
	this.bits = bits;
	this.value = value;
};
decode_huffman_HuffmanCode.__name__ = true;
decode_huffman_HuffmanCode.prototype = {
	__class__: decode_huffman_HuffmanCode
};
var decode_huffman_HuffmanTreeGroup = function() {
};
decode_huffman_HuffmanTreeGroup.__name__ = true;
decode_huffman_HuffmanTreeGroup.prototype = {
	__class__: decode_huffman_HuffmanTreeGroup
};
var decode_state_BrotliState = function() {
	this.code_length_code_lengths = new Array(18);
	this.table = new Array(32);
	this.block_type_rb_index = new Array(3);
	this.block_type_rb = new Array(6);
	this.num_block_types = new Array(3);
	this.block_type = new Array(3);
	this.block_length = new Array(3);
	this.br = new decode_bit_$reader_BrotliBitReader();
	this.hgroup = FunctionMalloc.malloc_decode_huffman_HuffmanTreeGroup(decode_huffman_HuffmanTreeGroup,3);
	this.dist_rb = new Array(4);
	this.sub_state = new Array(2);
};
decode_state_BrotliState.__name__ = true;
decode_state_BrotliState.prototype = {
	__class__: decode_state_BrotliState
};
var decode_streams_BrotliInput = function() {
};
decode_streams_BrotliInput.__name__ = true;
decode_streams_BrotliInput.prototype = {
	__class__: decode_streams_BrotliInput
};
var decode_streams_BrotliMemInput = function() {
};
decode_streams_BrotliMemInput.__name__ = true;
decode_streams_BrotliMemInput.prototype = {
	__class__: decode_streams_BrotliMemInput
};
var decode_streams_BrotliMemOutput = function() {
};
decode_streams_BrotliMemOutput.__name__ = true;
decode_streams_BrotliMemOutput.prototype = {
	__class__: decode_streams_BrotliMemOutput
};
var decode_streams_BrotliOutput = function() {
};
decode_streams_BrotliOutput.__name__ = true;
decode_streams_BrotliOutput.prototype = {
	__class__: decode_streams_BrotliOutput
};
var encode_Backward_$references = function() {
};
encode_Backward_$references.__name__ = true;
encode_Backward_$references.SetDistanceCache = function(distance,distance_code,max_distance,dist_cache,result_dist_cache,result_dist_cache_off) {
	if(distance <= max_distance && distance_code > 0) {
		result_dist_cache[0] = distance;
		DefaultFunctions.memcpy_Int(result_dist_cache,result_dist_cache_off + 1,dist_cache,0,3);
	} else {
		DefaultFunctions.memcpy_Int(result_dist_cache,result_dist_cache_off,dist_cache,0,4);
	}
};
encode_Backward_$references.ComputeDistanceCode = function(distance,max_distance,quality,dist_cache) {
	if(distance <= max_distance) {
		if(distance == dist_cache[0]) {
			return 0;
		} else if(distance == dist_cache[1]) {
			return 1;
		} else if(distance == dist_cache[2]) {
			return 2;
		} else if(distance == dist_cache[3]) {
			return 3;
		} else if(quality > 3 && distance >= 6) {
			var _g = 4;
			while(_g < 16) {
				var k = _g++;
				if(distance == dist_cache[encode_Hash.kDistanceCacheIndex[k]] + encode_Hash.kDistanceCacheOffset[k] && distance >= [0,0,0,0,6,6,11,11,11,11,11,11,12,12,12,12][k]) {
					return k;
				}
			}
		}
	}
	return distance + 15;
};
encode_Backward_$references.UpdateZopfliNode = function(nodes,nodes_off,pos,start_pos,len,len_code,dist,dist_code,max_dist,dist_cache,cost) {
	var next = nodes[nodes_off + pos + len];
	next.length = len;
	next.length_code = len_code;
	next.distance = dist;
	next.distance_code = dist_code;
	next.insert_length = pos - start_pos;
	next.cost = cost;
	encode_Backward_$references.SetDistanceCache(dist,dist_code,max_dist,dist_cache,next.distance_cache,0);
};
encode_Backward_$references.ComputeMinimumCopyLength = function(queue,nodes,model,pos,min_cost_cmd) {
	var start0 = queue.GetStartPos(0);
	var min_cost = nodes[start0].cost + model.GetLiteralCosts(start0,pos) + min_cost_cmd;
	var len = 2;
	var next_len_bucket = 4;
	var next_len_offset = 10;
	while(pos + len < nodes.length && nodes[pos + len].cost <= min_cost) {
		++len;
		if(len == next_len_offset) {
			min_cost += 1.0;
			next_len_offset += next_len_bucket;
			next_len_bucket *= 2;
		}
	}
	return len;
};
encode_Backward_$references.ZopfliIterate = function(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,model,num_matches,matches,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals) {
	var orig_commands_off = commands_off;
	var nodes = FunctionMalloc.malloc_encode_backward_references_ZopfliNode(encode_backward_$references_ZopfliNode,num_bytes + 1);
	nodes[0].length = 0;
	nodes[0].cost = 0;
	DefaultFunctions.memcpy_Int(nodes[0].distance_cache,0,dist_cache,0,4);
	var queue = new encode_backward_$references_StartPosQueue(3);
	var min_cost_cmd = model.GetMinCostCmd();
	var cur_match_pos = 0;
	var i = 0;
	while(i + 3 < num_bytes) {
		var cur_ix = position + i;
		var cur_ix_masked = cur_ix & ringbuffer_mask;
		var max_distance = Math.min(cur_ix,max_backward_limit) | 0;
		var max_length = num_bytes - i;
		queue.Push(i,nodes[i].cost - model.GetLiteralCosts(0,i));
		var min_len = encode_Backward_$references.ComputeMinimumCopyLength(queue,nodes,model,i,min_cost_cmd);
		var k = 0;
		while(k < 5 && k < queue.size()) {
			var start = queue.GetStartPos(k);
			var start_costdiff = nodes[start].cost - model.GetLiteralCosts(0,start);
			var dist_cache2 = nodes[start].distance_cache;
			var best_len = min_len - 1;
			var _g = 0;
			while(_g < 16) {
				var j = _g++;
				var backward = dist_cache2[encode_Hash.kDistanceCacheIndex[j]] + encode_Hash.kDistanceCacheOffset[j];
				var prev_ix = cur_ix - backward;
				if(prev_ix >= cur_ix) {
					continue;
				}
				if(backward > max_distance) {
					continue;
				}
				prev_ix &= ringbuffer_mask;
				if(cur_ix_masked + best_len > ringbuffer_mask || prev_ix + best_len > ringbuffer_mask || ringbuffer[cur_ix_masked + best_len] != ringbuffer[prev_ix + best_len]) {
					continue;
				}
				var _g2 = best_len + 1;
				var _g1 = encode_Find_$match_$length.FindMatchLengthWithLimit(ringbuffer,prev_ix,ringbuffer,cur_ix_masked,max_length) + 1;
				while(_g2 < _g1) {
					var l = _g2++;
					var cost = start_costdiff + model.GetCommandCost(j,l,i - start) + model.GetLiteralCosts(0,i);
					if(cost < nodes[i + l].cost) {
						encode_Backward_$references.UpdateZopfliNode(nodes,0,i,start,l,l,backward,j,max_distance,dist_cache2,cost);
					}
					best_len = l;
				}
			}
			if(k >= 2) {
				++k;
				continue;
			}
			var len = min_len;
			var _g11 = 0;
			var _g3 = num_matches[i];
			while(_g11 < _g3) {
				var match = matches[cur_match_pos + _g11++];
				var dist = match.distance;
				var is_dictionary_match = dist > max_distance;
				var dist_code = dist + 15;
				var max_len = match.length();
				if(len < max_len && (is_dictionary_match || max_len > 325)) {
					len = max_len;
				}
				while(len <= max_len) {
					var len_code = is_dictionary_match ? match.length_code() : len;
					var cost1 = start_costdiff + model.GetCommandCost(dist_code,len_code,i - start) + model.GetLiteralCosts(0,i);
					if(cost1 < nodes[i + len].cost) {
						encode_Backward_$references.UpdateZopfliNode(nodes,0,i,start,len,len_code,dist,dist_code,max_distance,dist_cache2,cost1);
					}
					++len;
				}
			}
			++k;
		}
		cur_match_pos += num_matches[i];
		if(num_matches[i] == 1 && matches[cur_match_pos - 1].length() > 325) {
			i += matches[cur_match_pos - 1].length() - 1;
			queue.Clear();
		}
		++i;
	}
	var backwards = [];
	var index = num_bytes;
	while(nodes[index].cost == encode_Backward_$references.kInfinity) --index;
	while(index > 0) {
		var len1 = nodes[index].length + nodes[index].insert_length;
		backwards.push(len1);
		index -= len1;
	}
	var path = [];
	var i1 = backwards.length;
	while(i1 > 0) {
		path.push(backwards[i1 - 1]);
		--i1;
	}
	var pos = 0;
	var _g12 = 0;
	var _g4 = path.length;
	while(_g12 < _g4) {
		var i2 = _g12++;
		var next = nodes[pos + path[i2]];
		var copy_length = next.length;
		var insert_length = next.insert_length;
		pos += insert_length;
		if(i2 == 0) {
			insert_length += last_insert_len[0];
		}
		var distance = next.distance;
		var is_dictionary = distance > (Math.min(position + pos,max_backward_limit) | 0);
		var dist_code1 = next.distance_code;
		var command = new encode_command_Command();
		command.Command4(insert_length,copy_length,next.length_code,dist_code1);
		commands[commands_off++] = command;
		if(!is_dictionary && dist_code1 > 0) {
			dist_cache[3] = dist_cache[2];
			dist_cache[2] = dist_cache[1];
			dist_cache[1] = dist_cache[0];
			dist_cache[0] = distance;
		}
		num_literals[0] += insert_length;
		insert_length = 0;
		pos += copy_length;
	}
	last_insert_len[0] = num_bytes - pos;
	num_commands[0] += commands_off - orig_commands_off;
};
encode_Backward_$references.CreateBackwardReferences_HashLongestMatch = function(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hasher,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals) {
	if(num_bytes >= 3 && position >= 3) {
		hasher.Store(ringbuffer,position - 3 & ringbuffer_mask,position - 3);
		hasher.Store(ringbuffer,position - 2 & ringbuffer_mask,position - 2);
		hasher.Store(ringbuffer,position - 1 & ringbuffer_mask,position - 1);
	}
	var orig_commands_off = commands_off;
	var insert_length = last_insert_len[0];
	var i = position & ringbuffer_mask;
	var i_diff = position - i;
	var i_end = i + num_bytes;
	var random_heuristics_window_size = quality < 9 ? 64 : 512;
	var apply_random_heuristics = i + random_heuristics_window_size;
	while(i + 3 < i_end) {
		var max_length = i_end - i;
		var max_distance = Math.min(i + i_diff,max_backward_limit) | 0;
		var best_len = [0];
		var best_len_code = [0];
		var best_dist = [0];
		var best_score = [4.0];
		var match_found = hasher.FindLongestMatch(ringbuffer,ringbuffer_mask,dist_cache,i + i_diff,max_length,max_distance,best_len,best_len_code,best_dist,best_score);
		if(match_found) {
			var delayed_backward_references_in_row = 0;
			while(true) {
				--max_length;
				var best_len_2 = [quality < 5 ? Math.min(best_len[0] - 1,max_length) | 0 : 0];
				var best_len_code_2 = [0];
				var best_dist_2 = [0];
				var best_score_2 = [4.0];
				max_distance = Math.min(i + i_diff + 1,max_backward_limit) | 0;
				hasher.Store(ringbuffer,i,i + i_diff);
				match_found = hasher.FindLongestMatch(ringbuffer,ringbuffer_mask,dist_cache,i + i_diff + 1,max_length,max_distance,best_len_2,best_len_code_2,best_dist_2,best_score_2);
				if(match_found && best_score_2[0] >= best_score[0] + 7.0) {
					++i;
					++insert_length;
					best_len[0] = best_len_2[0];
					best_len_code[0] = best_len_code_2[0];
					best_dist[0] = best_dist_2[0];
					best_score[0] = best_score_2[0];
					if(++delayed_backward_references_in_row < 4) {
						continue;
					}
				}
				break;
			}
			apply_random_heuristics = i + 2 * best_len[0] + random_heuristics_window_size;
			max_distance = Math.min(i + i_diff,max_backward_limit) | 0;
			var distance_code = encode_Backward_$references.ComputeDistanceCode(best_dist[0],max_distance,quality,dist_cache);
			if(best_dist[0] <= max_distance && distance_code > 0) {
				dist_cache[3] = dist_cache[2];
				dist_cache[2] = dist_cache[1];
				dist_cache[1] = dist_cache[0];
				dist_cache[0] = best_dist[0];
			}
			var command = new encode_command_Command();
			command.Command4(insert_length,best_len[0],best_len_code[0],distance_code);
			commands[commands_off++] = command;
			num_literals[0] += insert_length;
			insert_length = 0;
			var _g1 = 1;
			var _g = best_len[0];
			while(_g1 < _g) {
				var j = _g1++;
				hasher.Store(ringbuffer,i + j,i + i_diff + j);
			}
			i += best_len[0];
		} else {
			++insert_length;
			hasher.Store(ringbuffer,i,i + i_diff);
			++i;
			if(i > apply_random_heuristics) {
				if(i > apply_random_heuristics + 4 * random_heuristics_window_size) {
					var i_jump = Math.min(i + 16,i_end - 4) | 0;
					while(i < i_jump) {
						hasher.Store(ringbuffer,i,i + i_diff);
						insert_length += 4;
						i += 4;
					}
				} else {
					var i_jump1 = Math.min(i + 8,i_end - 3) | 0;
					while(i < i_jump1) {
						hasher.Store(ringbuffer,i,i + i_diff);
						insert_length += 2;
						i += 2;
					}
				}
			}
		}
	}
	insert_length += i_end - i;
	last_insert_len[0] = insert_length;
	num_commands[0] += commands_off - orig_commands_off;
};
encode_Backward_$references.CreateBackwardReferences_HashLongestMatchQuickly = function(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hasher,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals) {
	if(num_bytes >= 3 && position >= 3) {
		hasher.Store(ringbuffer,position - 3 & ringbuffer_mask,position - 3);
		hasher.Store(ringbuffer,position - 2 & ringbuffer_mask,position - 2);
		hasher.Store(ringbuffer,position - 1 & ringbuffer_mask,position - 1);
	}
	var orig_commands_off = commands_off;
	var insert_length = last_insert_len[0];
	var i = position & ringbuffer_mask;
	var i_diff = position - i;
	var i_end = i + num_bytes;
	var random_heuristics_window_size = quality < 9 ? 64 : 512;
	var apply_random_heuristics = i + random_heuristics_window_size;
	while(i + 3 < i_end) {
		var max_length = i_end - i;
		var max_distance = Math.min(i + i_diff,max_backward_limit) | 0;
		var best_len = [0];
		var best_len_code = [0];
		var best_dist = [0];
		var best_score = [4.0];
		var match_found = hasher.FindLongestMatch(ringbuffer,ringbuffer_mask,dist_cache,i + i_diff,max_length,max_distance,best_len,best_len_code,best_dist,best_score);
		if(match_found) {
			var delayed_backward_references_in_row = 0;
			while(true) {
				--max_length;
				var best_len_2 = [quality < 5 ? Math.min(best_len[0] - 1,max_length) | 0 : 0];
				var best_len_code_2 = [0];
				var best_dist_2 = [0];
				var best_score_2 = [4.0];
				max_distance = Math.min(i + i_diff + 1,max_backward_limit) | 0;
				hasher.Store(ringbuffer,i,i + i_diff);
				match_found = hasher.FindLongestMatch(ringbuffer,ringbuffer_mask,dist_cache,i + i_diff + 1,max_length,max_distance,best_len_2,best_len_code_2,best_dist_2,best_score_2);
				if(match_found && best_score_2[0] >= best_score[0] + 7.0) {
					++i;
					++insert_length;
					best_len[0] = best_len_2[0];
					best_len_code[0] = best_len_code_2[0];
					best_dist[0] = best_dist_2[0];
					best_score[0] = best_score_2[0];
					if(++delayed_backward_references_in_row < 4) {
						continue;
					}
				}
				break;
			}
			apply_random_heuristics = i + 2 * best_len[0] + random_heuristics_window_size;
			max_distance = Math.min(i + i_diff,max_backward_limit) | 0;
			var distance_code = encode_Backward_$references.ComputeDistanceCode(best_dist[0],max_distance,quality,dist_cache);
			if(best_dist[0] <= max_distance && distance_code > 0) {
				dist_cache[3] = dist_cache[2];
				dist_cache[2] = dist_cache[1];
				dist_cache[1] = dist_cache[0];
				dist_cache[0] = best_dist[0];
			}
			var command = new encode_command_Command();
			command.Command4(insert_length,best_len[0],best_len_code[0],distance_code);
			commands[commands_off++] = command;
			num_literals[0] += insert_length;
			insert_length = 0;
			var _g1 = 1;
			var _g = best_len[0];
			while(_g1 < _g) {
				var j = _g1++;
				hasher.Store(ringbuffer,i + j,i + i_diff + j);
			}
			i += best_len[0];
		} else {
			++insert_length;
			hasher.Store(ringbuffer,i,i + i_diff);
			++i;
			if(i > apply_random_heuristics) {
				if(i > apply_random_heuristics + 4 * random_heuristics_window_size) {
					var i_jump = Math.min(i + 16,i_end - 4) | 0;
					while(i < i_jump) {
						hasher.Store(ringbuffer,i,i + i_diff);
						insert_length += 4;
						i += 4;
					}
				} else {
					var i_jump1 = Math.min(i + 8,i_end - 3) | 0;
					while(i < i_jump1) {
						hasher.Store(ringbuffer,i,i + i_diff);
						insert_length += 2;
						i += 2;
					}
				}
			}
		}
	}
	insert_length += i_end - i;
	last_insert_len[0] = insert_length;
	num_commands[0] += commands_off - orig_commands_off;
};
encode_Backward_$references.CreateBackwardReferences = function(num_bytes,position,ringbuffer,ringbuffer_mask,literal_cost,literal_cost_mask,max_backward_limit,quality,hashers,hash_type,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals) {
	if(quality > 9) {
		var hasher = hashers.hash_h9;
		if(num_bytes >= 3 && position >= 3) {
			hasher.Store(ringbuffer,position - 3 & ringbuffer_mask,position - 3);
			hasher.Store(ringbuffer,position - 2 & ringbuffer_mask,position - 2);
			hasher.Store(ringbuffer,position - 1 & ringbuffer_mask,position - 1);
		}
		var num_matches = FunctionMalloc.mallocInt(num_bytes);
		var matches = FunctionMalloc.mallocArray_encode_hash_BackwardMatch(encode_hash_BackwardMatch,3 * num_bytes);
		var cur_match_pos = 0;
		var i = 0;
		while(i + 3 < num_bytes) {
			var max_distance = Math.min(position + i,max_backward_limit) | 0;
			if(matches.length < cur_match_pos + 325) {
				matches.concat(FunctionMalloc.mallocArray_encode_hash_BackwardMatch(encode_hash_BackwardMatch,cur_match_pos + 325 - matches.length));
			}
			hasher.FindAllMatches(ringbuffer,ringbuffer_mask,position + i,num_bytes - i,max_distance,num_matches,i,matches,cur_match_pos);
			hasher.Store(ringbuffer,position + i & ringbuffer_mask,position + i);
			cur_match_pos += num_matches[i];
			if(num_matches[i] == 1) {
				var match_len = matches[cur_match_pos - 1].length();
				if(match_len > 325) {
					var _g1 = 1;
					var _g = match_len;
					while(_g1 < _g) {
						_g1++;
						++i;
						hasher.Store(ringbuffer,position + i & ringbuffer_mask,position + i);
						num_matches[i] = 0;
					}
				}
			}
			++i;
		}
		var orig_num_literals = num_literals[0];
		var orig_last_insert_len = last_insert_len[0];
		var orig_dist_cache = new Array(4);
		orig_dist_cache[0] = dist_cache[0];
		orig_dist_cache[1] = dist_cache[1];
		orig_dist_cache[2] = dist_cache[2];
		orig_dist_cache[3] = dist_cache[3];
		var orig_num_commands = num_commands[0];
		var _g11 = 0;
		var _g2 = 2;
		while(_g11 < _g2) {
			var model = new encode_backward_$references_ZopfliCostModel();
			if(_g11++ == 0) {
				model.SetFromLiteralCosts(num_bytes,position,literal_cost,literal_cost_mask);
			} else {
				model.SetFromCommands(num_bytes,position,ringbuffer,ringbuffer_mask,commands,commands_off + num_commands[0] - orig_num_commands,orig_last_insert_len);
			}
			num_commands[0] = orig_num_commands;
			num_literals[0] = orig_num_literals;
			last_insert_len[0] = orig_last_insert_len;
			DefaultFunctions.memcpy_Int(dist_cache,0,orig_dist_cache,0,4);
			encode_Backward_$references.ZopfliIterate(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,model,num_matches,matches,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		}
		return;
	}
	switch(hash_type) {
	case 1:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatchQuickly(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h1,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 2:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatchQuickly(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h2,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 3:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatchQuickly(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h3,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 4:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatchQuickly(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h4,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 5:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatch(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h5,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 6:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatch(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h6,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 7:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatch(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h7,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 8:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatch(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h8,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	case 9:
		encode_Backward_$references.CreateBackwardReferences_HashLongestMatch(num_bytes,position,ringbuffer,ringbuffer_mask,max_backward_limit,quality,hashers.hash_h9,dist_cache,last_insert_len,commands,commands_off,num_commands,num_literals);
		break;
	default:
	}
};
encode_Backward_$references.prototype = {
	__class__: encode_Backward_$references
};
var encode_BinaryHeap = function() {
	this.arr = [];
	this.comp = $bind(this,this.HistogramPairComparator);
};
encode_BinaryHeap.__name__ = true;
encode_BinaryHeap.prototype = {
	HistogramPairComparator: function(p1,p2) {
		if(p1.cost_diff != p2.cost_diff) {
			if(p1.cost_diff < p2.cost_diff) {
				return 1;
			} else {
				return 0;
			}
		}
		if(Math.abs(p1.idx1 - p1.idx2) < Math.abs(p2.idx1 - p2.idx2)) {
			return 1;
		} else {
			return 0;
		}
	}
	,swap: function(a,b) {
		var temp = this.arr[a];
		this.arr[a] = this.arr[b];
		this.arr[b] = temp;
	}
	,bubbleDown: function(pos) {
		var left = 2 * pos + 1;
		var right = left + 1;
		var largest = pos;
		if(left < this.arr.length && this.comp(this.arr[left],this.arr[pos]) > 0) {
			largest = left;
		}
		if(right < this.arr.length && this.comp(this.arr[right],this.arr[largest]) > 0) {
			largest = right;
		}
		if(largest != pos) {
			this.swap(largest,pos);
			this.bubbleDown(largest);
		}
	}
	,bubbleUp: function(pos) {
		if(pos <= 0) {
			return;
		}
		var parent = Math.floor((pos - 1) / 2);
		if(this.comp(this.arr[pos],this.arr[parent]) > 0) {
			this.swap(pos,parent);
			this.bubbleUp(parent);
		}
	}
	,pop: function() {
		if(this.arr.length == 0) {
			return null;
		}
		var value = this.arr[0];
		var last = this.arr.length - 1;
		this.arr[0] = this.arr[last];
		this.arr.pop();
		if(last > 0) {
			this.bubbleDown(0);
		}
		return value;
	}
	,push: function(value) {
		this.arr.push(value);
		this.bubbleUp(this.arr.length - 1);
	}
	,size: function() {
		return this.arr.length;
	}
	,__class__: encode_BinaryHeap
};
var encode_Bit_$cost = function() {
};
encode_Bit_$cost.__name__ = true;
encode_Bit_$cost.BitsEntropy = function(population,population_off,size) {
	var sum = 0;
	var retval = 0;
	var population_end_off = population_off + size;
	var p;
	if((size & 1) > 0) {
		p = population[population_off++];
		sum = p;
		retval -= p * encode_Fast_$log.FastLog2(p);
	}
	while(population_off < population_end_off) {
		p = population[population_off++];
		sum += p;
		retval -= p * encode_Fast_$log.FastLog2(p);
		p = population[population_off++];
		sum += p;
		retval -= p * encode_Fast_$log.FastLog2(p);
	}
	if(sum > 0) {
		retval += sum * encode_Fast_$log.FastLog2(sum);
	}
	if(retval < sum) {
		retval = sum;
	}
	return retval;
};
encode_Bit_$cost.PopulationCost = function(histogram) {
	var kSize = histogram.data_.length;
	if(histogram.total_count_ == 0) {
		return 12;
	}
	var count = 0;
	var _g1 = 0;
	while(_g1 < kSize) if(histogram.data_[_g1++] > 0) {
		++count;
	}
	if(count == 1) {
		return 12;
	}
	if(count == 2) {
		return 20 + histogram.total_count_;
	}
	var bits = 0;
	var depth = FunctionMalloc.mallocUInt(kSize);
	if(count <= 4) {
		encode_Entropy_$encode.CreateHuffmanTree(histogram.data_,0,kSize,15,depth,0);
		var _g11 = 0;
		while(_g11 < kSize) {
			var i = _g11++;
			bits = _$UInt_UInt_$Impl_$.toFloat(histogram.data_[i] * depth[i]) + bits;
		}
		if(count == 3) {
			return bits + 28;
		} else {
			return bits + 37;
		}
	}
	var max_depth = 1;
	var depth_histo = FunctionMalloc.mallocInt(18);
	var log2total = encode_Fast_$log.FastLog2(histogram.total_count_);
	var i1 = 0;
	while(i1 < kSize) if(histogram.data_[i1] > 0) {
		var log2p = log2total - encode_Fast_$log.FastLog2(histogram.data_[i1]);
		var depth1 = log2p + 0.5 | 0;
		bits += histogram.data_[i1] * log2p;
		if(depth1 > 15) {
			depth1 = 15;
		}
		if(depth1 > max_depth) {
			max_depth = depth1;
		}
		var _g = depth1;
		depth_histo[_g] = depth_histo[_g] + 1;
		++i1;
	} else {
		var reps = 1;
		var k = i1 + 1;
		while(k < kSize && histogram.data_[k] == 0) {
			++reps;
			++k;
		}
		i1 += reps;
		if(i1 == kSize) {
			break;
		}
		if(reps < 3) {
			depth_histo[0] = depth_histo[0] + reps;
		} else {
			reps -= 2;
			while(reps > 0) {
				depth_histo[17] = depth_histo[17] + 1;
				bits += 3;
				reps >>= 3;
			}
		}
	}
	bits += 18 + 2 * max_depth;
	bits += encode_Bit_$cost.BitsEntropy(depth_histo,0,18);
	return bits;
};
encode_Bit_$cost.prototype = {
	__class__: encode_Bit_$cost
};
var encode_Block_$splitter = function() {
};
encode_Block_$splitter.__name__ = true;
encode_Block_$splitter.CopyLiteralsToByteArray = function(cmds,num_commands,data,data_off,literals) {
	var total_length = 0;
	var _g1 = 0;
	while(_g1 < num_commands) total_length += cmds[_g1++].insert_len_;
	if(total_length == 0) {
		return;
	}
	while(literals.length > total_length) literals.pop();
	var pos = 0;
	var from_pos = 0;
	var i = 0;
	while(i < num_commands && pos < total_length) {
		DefaultFunctions.memcpyArrayVector(literals,pos,data,data_off + from_pos,cmds[i].insert_len_);
		pos += cmds[i].insert_len_;
		from_pos += cmds[i].insert_len_ + cmds[i].copy_len_;
		++i;
	}
};
encode_Block_$splitter.CopyCommandsToByteArray = function(cmds,num_commands,insert_and_copy_codes,distance_prefixes) {
	var _g1 = 0;
	while(_g1 < num_commands) {
		var cmd = cmds[_g1++];
		insert_and_copy_codes.push(cmd.cmd_prefix_[0]);
		if(cmd.copy_len_ > 0 && _$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
			distance_prefixes.push(cmd.dist_prefix_[0]);
		}
	}
};
encode_Block_$splitter.MyRand = function(seed) {
	seed[0] = seed[0] * 16807;
	seed[0] = seed[0] >>> 0;
	if(seed[0] == 0) {
		seed[0] = 1;
	}
	return seed[0];
};
encode_Block_$splitter.InitialEntropyCodes = function(HistogramTypeInt,data,length,literals_per_histogram,max_histograms,stride,vec) {
	var total_histograms = (length / literals_per_histogram | 0) + 1;
	if(total_histograms > max_histograms) {
		total_histograms = max_histograms;
	}
	var seed_0 = 7;
	var block_length = length / total_histograms | 0;
	var _g1 = 0;
	var _g = total_histograms;
	while(_g1 < _g) {
		var i = _g1++;
		var pos = length * i / total_histograms | 0;
		if(i != 0) {
			seed_0 = seed_0 * 16807;
			seed_0 = seed_0 >>> 0;
			if(seed_0 == 0) {
				seed_0 = 1;
			}
			pos = pos + (_$UInt_UInt_$Impl_$.toFloat(seed_0) % _$UInt_UInt_$Impl_$.toFloat(block_length) | 0);
		}
		if(pos + stride >= length) {
			pos = length - stride - 1;
		}
		var histo = new encode_histogram_Histogram(HistogramTypeInt);
		histo.Add2(data,pos,stride);
		vec.push(histo);
	}
};
encode_Block_$splitter.RandomSample = function(seed,data,length,stride,sample) {
	var pos = 0;
	if(stride >= length) {
		pos = 0;
		stride = length;
	} else {
		seed[0] = seed[0] * 16807;
		seed[0] = seed[0] >>> 0;
		if(seed[0] == 0) {
			seed[0] = 1;
		}
		pos = _$UInt_UInt_$Impl_$.toFloat(seed[0]) % _$UInt_UInt_$Impl_$.toFloat(length - stride + 1) | 0;
	}
	sample.Add2(data,pos,stride);
};
encode_Block_$splitter.RefineEntropyCodes = function(HistogramTypeInt,data,length,stride,vec) {
	var iters = (2 * length / stride | 0) + 100;
	var seed = [7];
	iters = ((iters + vec.length - 1) / vec.length | 0) * vec.length;
	var _g1 = 0;
	var _g = iters;
	while(_g1 < _g) {
		var sample = new encode_histogram_Histogram(HistogramTypeInt);
		encode_Block_$splitter.RandomSample(seed,data,length,stride,sample);
		vec[_g1++ % vec.length].AddHistogram(sample);
	}
};
encode_Block_$splitter.BitCost = function(count) {
	if(count == 0) {
		return -2;
	} else {
		return encode_Fast_$log.FastLog2(count);
	}
};
encode_Block_$splitter.FindBlocks = function(kSize,data,length,block_switch_bitcost,vec,block_id,block_id_off) {
	if(vec.length <= 1) {
		var _g1 = 0;
		while(_g1 < length) block_id[_g1++] = 0;
		return;
	}
	var vecsize = vec.length;
	var insert_cost = FunctionMalloc.mallocFloat(kSize * vecsize);
	var _g11 = 0;
	while(_g11 < vecsize) {
		var j = _g11++;
		insert_cost[j] = encode_Fast_$log.FastLog2(vec[j].total_count_);
	}
	var i = kSize - 1;
	while(i >= 0) {
		var _g12 = 0;
		while(_g12 < vecsize) {
			var j1 = _g12++;
			var count = vec[j1].data_[i];
			insert_cost[i * vecsize + j1] = insert_cost[j1] - (count == 0 ? -2 : encode_Fast_$log.FastLog2(count));
		}
		--i;
	}
	var cost = FunctionMalloc.mallocFloat(vecsize);
	var switch_signal = FunctionMalloc.mallocBool(length * vecsize);
	var _g13 = 0;
	while(_g13 < length) {
		var byte_ix = _g13++;
		var ix = byte_ix * vecsize;
		var insert_cost_ix = data[byte_ix] * vecsize;
		var min_cost = 1e99;
		var _g3 = 0;
		while(_g3 < vecsize) {
			var k = _g3++;
			cost[k] = cost[k] + insert_cost[insert_cost_ix + k];
			if(cost[k] < min_cost) {
				min_cost = cost[k];
				block_id[byte_ix] = k;
			}
		}
		var block_switch_cost = block_switch_bitcost;
		if(byte_ix < 2000) {
			block_switch_cost = block_switch_bitcost * (0.77 + 0.07 * byte_ix / 2000);
		}
		var _g31 = 0;
		while(_g31 < vecsize) {
			var k1 = _g31++;
			cost[k1] = cost[k1] - min_cost;
			if(cost[k1] >= block_switch_cost) {
				cost[k1] = block_switch_cost;
				switch_signal[ix + k1] = true;
			}
		}
	}
	var byte_ix1 = length - 1;
	var ix1 = byte_ix1 * vecsize;
	var cur_id = block_id[byte_ix1];
	while(byte_ix1 > 0) {
		--byte_ix1;
		ix1 -= vecsize;
		if(switch_signal[ix1 + cur_id]) {
			cur_id = block_id[byte_ix1];
		}
		block_id[byte_ix1] = cur_id;
	}
};
encode_Block_$splitter.RemapBlockIds = function(block_ids,length) {
	var new_id_h = { };
	var next_id = 0;
	var _g1 = 0;
	while(_g1 < length) {
		var i = _g1++;
		if(new_id_h.hasOwnProperty(block_ids[i]) == false) {
			new_id_h[block_ids[i]] = next_id;
			++next_id;
		}
	}
	var _g11 = 0;
	while(_g11 < length) {
		var i1 = _g11++;
		block_ids[i1] = new_id_h[block_ids[i1]];
	}
	return next_id;
};
encode_Block_$splitter.BuildBlockHistograms = function(HistogramTypeInt,data,length,block_ids,block_ids_off,histograms) {
	var num_types = encode_Block_$splitter.RemapBlockIds(block_ids,length);
	while(histograms.length > 0) histograms.pop();
	var _g1 = 0;
	while(_g1 < num_types) {
		++_g1;
		histograms.push(new encode_histogram_Histogram(HistogramTypeInt));
	}
	var _g11 = 0;
	while(_g11 < length) {
		var i = _g11++;
		histograms[block_ids[i]].Add1(data[i]);
	}
};
encode_Block_$splitter.ClusterBlocks = function(HistogramTypeInt,data,length,block_ids) {
	var histograms = [];
	var block_index = FunctionMalloc.mallocInt(length);
	var cur_idx = 0;
	var cur_histogram = new encode_histogram_Histogram(HistogramTypeInt);
	var _g1 = 0;
	var _g = length;
	while(_g1 < _g) {
		var i = _g1++;
		var block_boundary = i + 1 == length || block_ids[i] != block_ids[i + 1];
		block_index[i] = cur_idx;
		cur_histogram.Add1(data[i]);
		if(block_boundary) {
			histograms.push(cur_histogram);
			cur_histogram = new encode_histogram_Histogram(HistogramTypeInt);
			++cur_idx;
		}
	}
	var clustered_histograms = [];
	var length1 = histograms.length;
	var histogram_symbols = new Array(length1);
	encode_Cluster.ClusterHistograms(histograms,1,histograms.length,256,clustered_histograms,HistogramTypeInt,histogram_symbols);
	var _g11 = 0;
	var _g2 = length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		block_ids[i1] = histogram_symbols[block_index[i1]];
	}
};
encode_Block_$splitter.BuildBlockSplit = function(block_ids,split) {
	var cur_id = block_ids[0];
	var cur_length = 1;
	split.num_types = -1;
	var _g1 = 1;
	var _g = block_ids.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(block_ids[i] != cur_id) {
			split.types.push(cur_id);
			split.lengths.push(cur_length);
			split.num_types = Math.max(split.num_types,cur_id) | 0;
			cur_id = block_ids[i];
			cur_length = 0;
		}
		++cur_length;
	}
	split.types.push(cur_id);
	split.lengths.push(cur_length);
	split.num_types = Math.max(split.num_types,cur_id) | 0;
	++split.num_types;
};
encode_Block_$splitter.SplitByteVector = function(HistogramTypeInt,data,literals_per_histogram,max_histograms,sampling_stride_length,block_switch_cost,split) {
	if(data.length == 0) {
		split.num_types = 1;
		return;
	} else if(data.length < 128) {
		split.num_types = 1;
		split.types.push(0);
		split.lengths.push(data.length);
		return;
	}
	var histograms = [];
	encode_Block_$splitter.InitialEntropyCodes(HistogramTypeInt,data,data.length,literals_per_histogram,max_histograms,sampling_stride_length,histograms);
	encode_Block_$splitter.RefineEntropyCodes(HistogramTypeInt,data,data.length,sampling_stride_length,histograms);
	var block_ids = FunctionMalloc.mallocUInt(data.length);
	var _g = 0;
	while(_g < 10) {
		++_g;
		encode_Block_$splitter.FindBlocks(HistogramTypeInt,data,data.length,block_switch_cost,histograms,block_ids,0);
		encode_Block_$splitter.BuildBlockHistograms(HistogramTypeInt,data,data.length,block_ids,0,histograms);
	}
	encode_Block_$splitter.ClusterBlocks(HistogramTypeInt,data,data.length,block_ids);
	encode_Block_$splitter.BuildBlockSplit(block_ids,split);
};
encode_Block_$splitter.SplitBlock = function(cmds,num_commands,data,data_off,literal_split,insert_and_copy_split,dist_split) {
	var literals = [];
	encode_Block_$splitter.CopyLiteralsToByteArray(cmds,num_commands,data,data_off,literals);
	var insert_and_copy_codes = [];
	var distance_prefixes = [];
	encode_Block_$splitter.CopyCommandsToByteArray(cmds,num_commands,insert_and_copy_codes,distance_prefixes);
	encode_Block_$splitter.SplitByteVector(encode_Histogram_$functions.HistogramLiteralInt,literals,544,100,70,28.1,literal_split);
	encode_Block_$splitter.SplitByteVector(encode_Histogram_$functions.HistogramCommandInt,insert_and_copy_codes,530,50,40,13.5,insert_and_copy_split);
	encode_Block_$splitter.SplitByteVector(encode_Histogram_$functions.HistogramDistanceInt,distance_prefixes,544,50,40,14.6,dist_split);
};
encode_Block_$splitter.prototype = {
	__class__: encode_Block_$splitter
};
var encode_Brotli_$bit_$stream = function() {
};
encode_Brotli_$bit_$stream.__name__ = true;
encode_Brotli_$bit_$stream.EncodeMlen = function(length,bits,numbits,nibblesbits) {
	--length;
	var lg = length == 0 ? 1 : encode_Fast_$log.Log2Floor(length) + 1;
	if(lg > 24) {
		return false;
	}
	var mnibbles = (lg < 16 ? 16 : lg + 3) / 4 | 0;
	nibblesbits[0] = mnibbles - 4;
	numbits[0] = mnibbles * 4;
	bits[0] = length;
	return true;
};
encode_Brotli_$bit_$stream.StoreVarLenUint8 = function(n,storage_ix,storage) {
	if(n == 0) {
		encode_Write_$bits.WriteBits(1,0,storage_ix,storage);
	} else {
		encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
		var nbits = encode_Fast_$log.Log2Floor(n);
		encode_Write_$bits.WriteBits(3,nbits,storage_ix,storage);
		encode_Write_$bits.WriteBits(nbits,n - (1 << nbits),storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.StoreCompressedMetaBlockHeader = function(final_block,length,storage_ix,storage) {
	encode_Write_$bits.WriteBits(1,final_block ? 1 : 0,storage_ix,storage);
	if(final_block) {
		encode_Write_$bits.WriteBits(1,length == 0 ? 1 : 0,storage_ix,storage);
		if(length == 0) {
			return true;
		}
	}
	if(length == 0) {
		return false;
	}
	var lenbits = [];
	var nlenbits = [];
	var nibblesbits = [];
	if(!encode_Brotli_$bit_$stream.EncodeMlen(length,lenbits,nlenbits,nibblesbits)) {
		return false;
	}
	encode_Write_$bits.WriteBits(2,nibblesbits[0],storage_ix,storage);
	encode_Write_$bits.WriteBits(nlenbits[0],lenbits[0],storage_ix,storage);
	if(!final_block) {
		encode_Write_$bits.WriteBits(1,0,storage_ix,storage);
	}
	return true;
};
encode_Brotli_$bit_$stream.StoreUncompressedMetaBlockHeader = function(length,storage_ix,storage) {
	encode_Write_$bits.WriteBits(1,0,storage_ix,storage);
	var lenbits = [];
	var nlenbits = [];
	var nibblesbits = [];
	if(!encode_Brotli_$bit_$stream.EncodeMlen(length,lenbits,nlenbits,nibblesbits)) {
		return false;
	}
	encode_Write_$bits.WriteBits(2,nibblesbits[0],storage_ix,storage);
	encode_Write_$bits.WriteBits(nlenbits[0],lenbits[0],storage_ix,storage);
	encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
	return true;
};
encode_Brotli_$bit_$stream.StoreHuffmanTreeOfHuffmanTreeToBitMask = function(num_codes,code_length_bitdepth,storage_ix,storage) {
	var kStorageOrder = [1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15];
	var kHuffmanBitLengthHuffmanCodeSymbols = [0,7,3,2,1,15];
	var kHuffmanBitLengthHuffmanCodeBitLengths = [2,4,3,2,2,4];
	var codes_to_store = 18;
	if(num_codes > 1) {
		while(codes_to_store > 0) {
			if(code_length_bitdepth[kStorageOrder[codes_to_store - 1]] != 0) {
				break;
			}
			--codes_to_store;
		}
	}
	var skip_some = 0;
	if(code_length_bitdepth[kStorageOrder[0]] == 0 && code_length_bitdepth[kStorageOrder[1]] == 0) {
		skip_some = 2;
		if(code_length_bitdepth[kStorageOrder[2]] == 0) {
			skip_some = 3;
		}
	}
	encode_Write_$bits.WriteBits(2,skip_some,storage_ix,storage);
	var _g1 = skip_some;
	var _g = codes_to_store;
	while(_g1 < _g) {
		var l = code_length_bitdepth[kStorageOrder[_g1++]];
		encode_Write_$bits.WriteBits(kHuffmanBitLengthHuffmanCodeBitLengths[l],kHuffmanBitLengthHuffmanCodeSymbols[l],storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.StoreHuffmanTreeToBitMask = function(huffman_tree,huffman_tree_extra_bits,code_length_bitdepth,code_length_bitdepth_off,code_length_bitdepth_symbols,storage_ix,storage) {
	var _g1 = 0;
	var _g = huffman_tree.length;
	while(_g1 < _g) {
		var i = _g1++;
		var ix = huffman_tree[i];
		encode_Write_$bits.WriteBits(code_length_bitdepth[ix],code_length_bitdepth_symbols[ix],storage_ix,storage);
		switch(ix) {
		case 16:
			encode_Write_$bits.WriteBits(2,huffman_tree_extra_bits[i],storage_ix,storage);
			break;
		case 17:
			encode_Write_$bits.WriteBits(3,huffman_tree_extra_bits[i],storage_ix,storage);
			break;
		}
	}
};
encode_Brotli_$bit_$stream.StoreSimpleHuffmanTree = function(depths,depths_off,symbols,num_symbols,max_bits,storage_ix,storage) {
	encode_Write_$bits.WriteBits(2,1,storage_ix,storage);
	encode_Write_$bits.WriteBits(2,num_symbols - 1,storage_ix,storage);
	var _g1 = 0;
	while(_g1 < num_symbols) {
		var i = _g1++;
		var _g3 = i + 1;
		while(_g3 < num_symbols) {
			var j = _g3++;
			if(_$UInt_UInt_$Impl_$.gt(depths[depths_off + symbols[i]],depths[depths_off + symbols[j]])) {
				var t = symbols[j];
				symbols[j] = symbols[i];
				symbols[i] = t;
			}
		}
	}
	if(num_symbols == 2) {
		encode_Write_$bits.WriteBits(max_bits,symbols[0],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[1],storage_ix,storage);
	} else if(num_symbols == 3) {
		encode_Write_$bits.WriteBits(max_bits,symbols[0],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[1],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[2],storage_ix,storage);
	} else {
		encode_Write_$bits.WriteBits(max_bits,symbols[0],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[1],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[2],storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,symbols[3],storage_ix,storage);
		encode_Write_$bits.WriteBits(1,depths[depths_off + symbols[0]] == 1 ? 1 : 0,storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.StoreHuffmanTree = function(depths,depths_off,num,storage_ix,storage) {
	var huffman_tree = [];
	var huffman_tree_extra_bits = [];
	encode_Entropy_$encode.WriteHuffmanTree(depths,depths_off,num,huffman_tree,huffman_tree_extra_bits);
	var huffman_tree_histogram = FunctionMalloc.mallocInt(18);
	var _g1 = 0;
	var _g = huffman_tree.length;
	while(_g1 < _g) {
		var _g2 = huffman_tree[_g1++];
		huffman_tree_histogram[_g2] = huffman_tree_histogram[_g2] + 1;
	}
	var num_codes = 0;
	var code = 0;
	var _g3 = 0;
	while(_g3 < 18) {
		var i = _g3++;
		if(huffman_tree_histogram[i] > 0) {
			if(num_codes == 0) {
				code = i;
				num_codes = 1;
			} else if(num_codes == 1) {
				num_codes = 2;
				break;
			}
		}
	}
	var code_length_bitdepth = FunctionMalloc.mallocUInt(18);
	var code_length_bitdepth_symbols = FunctionMalloc.mallocUInt(18);
	encode_Entropy_$encode.CreateHuffmanTree(huffman_tree_histogram,0,18,5,code_length_bitdepth,0);
	encode_Entropy_$encode.ConvertBitDepthsToSymbols(code_length_bitdepth,0,18,code_length_bitdepth_symbols,0);
	encode_Brotli_$bit_$stream.StoreHuffmanTreeOfHuffmanTreeToBitMask(num_codes,code_length_bitdepth,storage_ix,storage);
	if(num_codes == 1) {
		code_length_bitdepth[code] = 0;
	}
	encode_Brotli_$bit_$stream.StoreHuffmanTreeToBitMask(huffman_tree,huffman_tree_extra_bits,code_length_bitdepth,0,code_length_bitdepth_symbols,storage_ix,storage);
};
encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree = function(histogram,length,depth,depth_off,bits,bits_off,storage_ix,storage) {
	var count = 0;
	var s4 = [0,0,0,0];
	var _g1 = 0;
	while(_g1 < length) {
		var i = _g1++;
		if(histogram[i] > 0) {
			if(count < 4) {
				s4[count] = i;
			} else if(count > 4) {
				break;
			}
			++count;
		}
	}
	var max_bits_counter = length - 1;
	var max_bits = 0;
	while(max_bits_counter > 0) {
		max_bits_counter >>= 1;
		++max_bits;
	}
	if(count <= 1) {
		encode_Write_$bits.WriteBits(4,1,storage_ix,storage);
		encode_Write_$bits.WriteBits(max_bits,s4[0],storage_ix,storage);
		return;
	}
	encode_Entropy_$encode.CreateHuffmanTree(histogram,0,length,15,depth,depth_off);
	encode_Entropy_$encode.ConvertBitDepthsToSymbols(depth,depth_off,length,bits,bits_off);
	if(count <= 4) {
		encode_Brotli_$bit_$stream.StoreSimpleHuffmanTree(depth,depth_off,s4,count,max_bits,storage_ix,storage);
	} else {
		encode_Brotli_$bit_$stream.StoreHuffmanTree(depth,depth_off,length,storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.IndexOf = function(v,value) {
	var _g1 = 0;
	var _g = v.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(v[i] == value) {
			return i;
		}
	}
	return -1;
};
encode_Brotli_$bit_$stream.MoveToFront = function(v,index) {
	var value = v[index];
	var i = index;
	while(i > 0) {
		v[i] = v[i - 1];
		--i;
	}
	v[0] = value;
};
encode_Brotli_$bit_$stream.MoveToFrontTransform = function(v) {
	if(v.length == 0) {
		return v;
	}
	var max_element = 0;
	var _g1 = 0;
	var _g = v.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(max_element < v[i]) {
			max_element = v[i];
		}
	}
	var mtf = new Array(max_element + 1);
	var _g11 = 0;
	var _g2 = mtf.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		mtf[i1] = i1;
	}
	var length = v.length;
	var result = new Array(length);
	var _g12 = 0;
	var _g3 = v.length;
	while(_g12 < _g3) {
		var i2 = _g12++;
		var index = encode_Brotli_$bit_$stream.IndexOf(mtf,v[i2]);
		result[i2] = index;
		encode_Brotli_$bit_$stream.MoveToFront(mtf,index);
	}
	return result;
};
encode_Brotli_$bit_$stream.RunLengthCodeZeros = function(v_in,max_run_length_prefix,v_out,extra_bits) {
	var max_reps = 0;
	var i = 0;
	while(i < v_in.length) {
		while(i < v_in.length && v_in[i] != 0) ++i;
		var reps = 0;
		while(i < v_in.length && v_in[i] == 0) {
			++reps;
			++i;
		}
		max_reps = Math.max(reps,max_reps) | 0;
	}
	max_run_length_prefix[0] = Math.min(max_reps > 0 ? encode_Fast_$log.Log2Floor(max_reps) : 0,max_run_length_prefix[0]) | 0;
	var i1 = 0;
	while(i1 < v_in.length) if(v_in[i1] != 0) {
		v_out.push(v_in[i1] + max_run_length_prefix[0]);
		extra_bits.push(0);
		++i1;
	} else {
		var reps1 = 1;
		var k = i1 + 1;
		while(k < v_in.length && v_in[k] == 0) {
			++reps1;
			++k;
		}
		i1 += reps1;
		while(reps1 > 0) if(reps1 < 2 << max_run_length_prefix[0]) {
			var run_length_prefix = encode_Fast_$log.Log2Floor(reps1);
			v_out.push(run_length_prefix);
			extra_bits.push(reps1 - (1 << run_length_prefix));
			break;
		} else {
			v_out.push(max_run_length_prefix[0]);
			extra_bits.push((1 << max_run_length_prefix[0]) - 1);
			reps1 -= (2 << max_run_length_prefix[0]) - 1;
		}
	}
};
encode_Brotli_$bit_$stream.EncodeContextMap = function(context_map,num_clusters,storage_ix,storage) {
	encode_Brotli_$bit_$stream.StoreVarLenUint8(num_clusters - 1,storage_ix,storage);
	if(num_clusters == 1) {
		return;
	}
	var transformed_symbols = encode_Brotli_$bit_$stream.MoveToFrontTransform(context_map);
	var rle_symbols = [];
	var extra_bits = [];
	var max_run_length_prefix = [6];
	encode_Brotli_$bit_$stream.RunLengthCodeZeros(transformed_symbols,max_run_length_prefix,rle_symbols,extra_bits);
	var symbol_histogram = encode_Histogram_$functions.HistogramContextMap();
	var _g1 = 0;
	var _g = rle_symbols.length;
	while(_g1 < _g) symbol_histogram.Add1(rle_symbols[_g1++]);
	var use_rle = max_run_length_prefix[0] > 0;
	encode_Write_$bits.WriteBits(1,use_rle ? 1 : 0,storage_ix,storage);
	if(use_rle) {
		encode_Write_$bits.WriteBits(4,max_run_length_prefix[0] - 1,storage_ix,storage);
	}
	var symbol_code = encode_Entropy_$encode.EntropyCodeContextMap();
	DefaultFunctions.memset_UInt(symbol_code.depth_,0,0,symbol_code.depth_.length);
	DefaultFunctions.memset_UInt(symbol_code.bits_,0,0,symbol_code.bits_.length);
	encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(symbol_histogram.data_,num_clusters + max_run_length_prefix[0],symbol_code.depth_,0,symbol_code.bits_,0,storage_ix,storage);
	var _g11 = 0;
	var _g2 = rle_symbols.length;
	while(_g11 < _g2) {
		var i = _g11++;
		encode_Write_$bits.WriteBits(symbol_code.depth_[rle_symbols[i]],symbol_code.bits_[rle_symbols[i]],storage_ix,storage);
		if(rle_symbols[i] > 0 && rle_symbols[i] <= max_run_length_prefix[0]) {
			encode_Write_$bits.WriteBits(rle_symbols[i],extra_bits[i],storage_ix,storage);
		}
	}
	encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
};
encode_Brotli_$bit_$stream.StoreBlockSwitch = function(code,block_ix,storage_ix,storage) {
	if(block_ix > 0) {
		var typecode = code.type_code[block_ix];
		encode_Write_$bits.WriteBits(code.type_depths[typecode],code.type_bits[typecode],storage_ix,storage);
	}
	var lencode = code.length_prefix[block_ix];
	encode_Write_$bits.WriteBits(code.length_depths[lencode],code.length_bits[lencode],storage_ix,storage);
	encode_Write_$bits.WriteBits(code.length_nextra[block_ix],code.length_extra[block_ix],storage_ix,storage);
};
encode_Brotli_$bit_$stream.BuildAndStoreBlockSplitCode = function(types,lengths,num_types,code,storage_ix,storage) {
	var num_blocks = types.length;
	var type_histo = FunctionMalloc.mallocInt(num_types + 2);
	var length_histo = FunctionMalloc.mallocInt(26);
	var last_type = 1;
	var second_last_type = 0;
	code.type_code = FunctionMalloc.mallocInt(num_blocks);
	code.length_prefix = FunctionMalloc.mallocInt(num_blocks);
	code.length_nextra = FunctionMalloc.mallocInt(num_blocks);
	code.length_extra = FunctionMalloc.mallocInt(num_blocks);
	code.type_depths = FunctionMalloc.mallocUInt(num_types + 2);
	code.type_bits = FunctionMalloc.mallocUInt(num_types + 2);
	code.length_depths = FunctionMalloc.mallocUInt(26);
	code.length_bits = FunctionMalloc.mallocUInt(26);
	var _g1 = 0;
	while(_g1 < num_blocks) {
		var i = _g1++;
		var type = types[i];
		var type_code = type == last_type + 1 ? 1 : type == second_last_type ? 0 : type + 2;
		second_last_type = last_type;
		last_type = type;
		code.type_code[i] = type_code;
		if(i > 0) {
			var _g2 = type_code;
			type_histo[_g2] = type_histo[_g2] + 1;
		}
		encode_Prefix.GetBlockLengthPrefixCode(lengths[i],code.length_prefix,i,code.length_nextra,i,code.length_extra,i);
		var _g21 = code.length_prefix[i];
		length_histo[_g21] = length_histo[_g21] + 1;
	}
	encode_Brotli_$bit_$stream.StoreVarLenUint8(num_types - 1,storage_ix,storage);
	if(num_types > 1) {
		encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(type_histo,num_types + 2,code.type_depths,0,code.type_bits,0,storage_ix,storage);
		encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(length_histo,26,code.length_depths,0,code.length_bits,0,storage_ix,storage);
		encode_Brotli_$bit_$stream.StoreBlockSwitch(code,0,storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.StoreTrivialContextMap = function(num_types,context_bits,storage_ix,storage) {
	encode_Brotli_$bit_$stream.StoreVarLenUint8(num_types - 1,storage_ix,storage);
	if(num_types > 1) {
		var repeat_code = context_bits - 1;
		var repeat_bits = (1 << repeat_code) - 1;
		var alphabet_size = num_types + repeat_code;
		var histogram = FunctionMalloc.mallocInt(alphabet_size);
		var depths = FunctionMalloc.mallocUInt(alphabet_size);
		var bits = FunctionMalloc.mallocUInt(alphabet_size);
		encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
		encode_Write_$bits.WriteBits(4,repeat_code - 1,storage_ix,storage);
		histogram[repeat_code] = num_types;
		histogram[0] = 1;
		var _g1 = context_bits;
		while(_g1 < alphabet_size) histogram[_g1++] = 1;
		encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(histogram,alphabet_size,depths,0,bits,0,storage_ix,storage);
		var _g11 = 0;
		while(_g11 < num_types) {
			var i = _g11++;
			var code = i == 0 ? 0 : i + context_bits - 1;
			encode_Write_$bits.WriteBits(depths[code],bits[code],storage_ix,storage);
			encode_Write_$bits.WriteBits(depths[repeat_code],bits[repeat_code],storage_ix,storage);
			encode_Write_$bits.WriteBits(repeat_code,repeat_bits,storage_ix,storage);
		}
		encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
	}
};
encode_Brotli_$bit_$stream.JumpToByteBoundary = function(storage_ix,storage) {
	storage_ix[0] = storage_ix[0] + 7 & -8;
	storage[storage_ix[0] >> 3] = 0;
};
encode_Brotli_$bit_$stream.StoreMetaBlock = function(input,start_pos,length,mask,prev_byte,prev_byte2,is_last,num_direct_distance_codes,distance_postfix_bits,literal_context_mode,commands,n_commands,mb,storage_ix,storage) {
	if(!encode_Brotli_$bit_$stream.StoreCompressedMetaBlockHeader(is_last,length,storage_ix,storage)) {
		return false;
	}
	if(length == 0) {
		encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
		return true;
	}
	var literal_enc = new encode_brotli_$bit_$stream_BlockEncoder(256,mb.literal_split.num_types,mb.literal_split.types,mb.literal_split.lengths);
	var command_enc = new encode_brotli_$bit_$stream_BlockEncoder(704,mb.command_split.num_types,mb.command_split.types,mb.command_split.lengths);
	var distance_enc = new encode_brotli_$bit_$stream_BlockEncoder(16 + num_direct_distance_codes + (48 << distance_postfix_bits),mb.distance_split.num_types,mb.distance_split.types,mb.distance_split.lengths);
	literal_enc.BuildAndStoreBlockSwitchEntropyCodes(storage_ix,storage);
	command_enc.BuildAndStoreBlockSwitchEntropyCodes(storage_ix,storage);
	distance_enc.BuildAndStoreBlockSwitchEntropyCodes(storage_ix,storage);
	encode_Write_$bits.WriteBits(2,distance_postfix_bits,storage_ix,storage);
	encode_Write_$bits.WriteBits(4,num_direct_distance_codes >> distance_postfix_bits,storage_ix,storage);
	var _g1 = 0;
	var _g = mb.literal_split.num_types;
	while(_g1 < _g) {
		++_g1;
		encode_Write_$bits.WriteBits(2,literal_context_mode,storage_ix,storage);
	}
	if(mb.literal_context_map.length == 0) {
		encode_Brotli_$bit_$stream.StoreTrivialContextMap(mb.literal_histograms.length,6,storage_ix,storage);
	} else {
		encode_Brotli_$bit_$stream.EncodeContextMap(mb.literal_context_map,mb.literal_histograms.length,storage_ix,storage);
	}
	if(mb.distance_context_map.length == 0) {
		encode_Brotli_$bit_$stream.StoreTrivialContextMap(mb.distance_histograms.length,2,storage_ix,storage);
	} else {
		encode_Brotli_$bit_$stream.EncodeContextMap(mb.distance_context_map,mb.distance_histograms.length,storage_ix,storage);
	}
	literal_enc.BuildAndStoreEntropyCodes(mb.literal_histograms,storage_ix,storage);
	command_enc.BuildAndStoreEntropyCodes(mb.command_histograms,storage_ix,storage);
	distance_enc.BuildAndStoreEntropyCodes(mb.distance_histograms,storage_ix,storage);
	var pos = start_pos;
	var _g11 = 0;
	while(_g11 < n_commands) {
		var cmd = commands[_g11++];
		var lennumextra = cmd.cmd_extra_[0] >>> 16;
		var lenextra = cmd.cmd_extra_;
		command_enc.StoreSymbol(cmd.cmd_prefix_[0],storage_ix,storage);
		if(lennumextra >= 32) {
			encode_Write_$bits.WriteBits(lennumextra - 32,lenextra[0],storage_ix,storage);
		}
		encode_Write_$bits.WriteBits(lennumextra < 32 ? lennumextra : 32,lenextra[1],storage_ix,storage);
		if(mb.literal_context_map.length == 0) {
			var _g3 = 0;
			var _g2 = cmd.insert_len_;
			while(_g3 < _g2) {
				++_g3;
				literal_enc.StoreSymbol(input[pos & mask],storage_ix,storage);
				++pos;
			}
		} else {
			var _g31 = 0;
			var _g21 = cmd.insert_len_;
			while(_g31 < _g21) {
				++_g31;
				var literal = input[pos & mask];
				literal_enc.StoreSymbolWithContext(6,literal,encode_Context.ContextFunction(prev_byte,prev_byte2,literal_context_mode),mb.literal_context_map,storage_ix,storage);
				prev_byte2 = prev_byte;
				prev_byte = literal;
				++pos;
			}
		}
		pos += cmd.copy_len_;
		if(cmd.copy_len_ > 0) {
			prev_byte2 = input[pos - 2 & mask];
			prev_byte = input[pos - 1 & mask];
			if(_$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
				var dist_code = cmd.dist_prefix_[0];
				var distnumextra = cmd.dist_extra_[0] >>> 24;
				var distextra = cmd.dist_extra_[0] & 16777215;
				if(mb.distance_context_map.length == 0) {
					distance_enc.StoreSymbol(dist_code,storage_ix,storage);
				} else {
					distance_enc.StoreSymbolWithContext(2,dist_code,cmd.DistanceContext(),mb.distance_context_map,storage_ix,storage);
				}
				encode_Write_$bits.WriteBits(distnumextra,distextra,storage_ix,storage);
			}
		}
	}
	if(is_last) {
		encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
	}
	return true;
};
encode_Brotli_$bit_$stream.StoreMetaBlockTrivial = function(input,start_pos,length,mask,is_last,commands,n_commands,storage_ix,storage,storage_off) {
	if(!encode_Brotli_$bit_$stream.StoreCompressedMetaBlockHeader(is_last,length,storage_ix,storage)) {
		return false;
	}
	if(length == 0) {
		encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
		return true;
	}
	var lit_histo = encode_Histogram_$functions.HistogramLiteral();
	var cmd_histo = encode_Histogram_$functions.HistogramCommand();
	var dist_histo = encode_Histogram_$functions.HistogramDistance();
	var pos = start_pos;
	var _g1 = 0;
	while(_g1 < n_commands) {
		var cmd = commands[_g1++];
		cmd_histo.Add1(cmd.cmd_prefix_[0]);
		var _g3 = 0;
		var _g2 = cmd.insert_len_;
		while(_g3 < _g2) {
			++_g3;
			lit_histo.Add1(input[pos & mask]);
			++pos;
		}
		pos += cmd.copy_len_;
		if(cmd.copy_len_ > 0 && _$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
			dist_histo.Add1(cmd.dist_prefix_[0]);
		}
	}
	encode_Write_$bits.WriteBits(13,0,storage_ix,storage);
	var lit_depth = FunctionMalloc.mallocUInt(256);
	var lit_bits = FunctionMalloc.mallocUInt(256);
	var cmd_depth = FunctionMalloc.mallocUInt(704);
	var cmd_bits = FunctionMalloc.mallocUInt(704);
	var dist_depth = FunctionMalloc.mallocUInt(64);
	var dist_bits = FunctionMalloc.mallocUInt(64);
	encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(lit_histo.data_,256,lit_depth,0,lit_bits,0,storage_ix,storage);
	encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(cmd_histo.data_,704,cmd_depth,0,cmd_bits,0,storage_ix,storage);
	encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(dist_histo.data_,64,dist_depth,0,dist_bits,0,storage_ix,storage);
	pos = start_pos;
	var _g11 = 0;
	while(_g11 < n_commands) {
		var cmd1 = commands[_g11++];
		var cmd_code = cmd1.cmd_prefix_[0];
		var lennumextra = cmd1.cmd_extra_[0] >>> 16;
		var lenextra = cmd1.cmd_extra_;
		encode_Write_$bits.WriteBits(cmd_depth[cmd_code],cmd_bits[cmd_code],storage_ix,storage);
		if(lennumextra >= 32) {
			encode_Write_$bits.WriteBits(lennumextra - 32,lenextra[0],storage_ix,storage);
		}
		encode_Write_$bits.WriteBits(lennumextra < 32 ? lennumextra : 32,lenextra[1],storage_ix,storage);
		var _g31 = 0;
		var _g21 = cmd1.insert_len_;
		while(_g31 < _g21) {
			++_g31;
			var literal = input[pos & mask];
			encode_Write_$bits.WriteBits(lit_depth[literal],lit_bits[literal],storage_ix,storage);
			++pos;
		}
		pos += cmd1.copy_len_;
		if(cmd1.copy_len_ > 0 && _$UInt_UInt_$Impl_$.gte(cmd1.cmd_prefix_[0],128)) {
			var dist_code = cmd1.dist_prefix_[0];
			var distnumextra = cmd1.dist_extra_[0] >>> 24;
			var distextra = cmd1.dist_extra_[0] & 16777215;
			encode_Write_$bits.WriteBits(dist_depth[dist_code],dist_bits[dist_code],storage_ix,storage);
			encode_Write_$bits.WriteBits(distnumextra,distextra,storage_ix,storage);
		}
	}
	if(is_last) {
		encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
	}
	return true;
};
encode_Brotli_$bit_$stream.StoreUncompressedMetaBlock = function(final_block,input,position,mask,len,storage_ix,storage,storage_off) {
	if(!encode_Brotli_$bit_$stream.StoreUncompressedMetaBlockHeader(len,storage_ix,storage)) {
		return false;
	}
	encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
	var masked_pos = position & mask;
	if(masked_pos + len > mask + 1) {
		var len1 = mask + 1 - masked_pos;
		DefaultFunctions.memcpy_UInt(storage,storage_ix[0] >> 3,input,masked_pos,len1);
		storage_ix[0] += len1 << 3;
		len -= len1;
		masked_pos = 0;
	}
	DefaultFunctions.memcpy_UInt(storage,storage_ix[0] >> 3,input,masked_pos,len);
	encode_Write_$bits.WriteBitsPrepareStorage(storage_ix[0] += len << 3,storage);
	if(final_block) {
		encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
		encode_Write_$bits.WriteBits(1,1,storage_ix,storage);
		encode_Brotli_$bit_$stream.JumpToByteBoundary(storage_ix,storage);
	}
	return true;
};
encode_Brotli_$bit_$stream.prototype = {
	__class__: encode_Brotli_$bit_$stream
};
var encode_Cluster = function() {
};
encode_Cluster.__name__ = true;
encode_Cluster.HistogramPairComparator = function(p1,p2) {
	if(p1.cost_diff != p2.cost_diff) {
		if(p1.cost_diff > p2.cost_diff) {
			return 1;
		} else {
			return -1;
		}
	}
	if(Math.abs(p1.idx1 - p1.idx2) > Math.abs(p2.idx1 - p2.idx2)) {
		return 1;
	} else {
		return -1;
	}
};
encode_Cluster.ClusterCostDiff = function(size_a,size_b) {
	var size_c = size_a + size_b;
	return size_a * encode_Fast_$log.FastLog2(size_a) + size_b * encode_Fast_$log.FastLog2(size_b) - size_c * encode_Fast_$log.FastLog2(size_c);
};
encode_Cluster.CompareAndPushToHeap = function(out,cluster_size,idx1,idx2,pairs) {
	if(idx1 == idx2) {
		return;
	}
	if(idx2 < idx1) {
		var t = idx2;
		idx2 = idx1;
		idx1 = t;
	}
	var store_pair = false;
	var p = new encode_cluster_HistogramPair();
	p.idx1 = idx1;
	p.idx2 = idx2;
	p.valid = true;
	p.cost_diff = 0.5 * encode_Cluster.ClusterCostDiff(cluster_size[idx1],cluster_size[idx2]);
	p.cost_diff = (p.cost_diff -= out[idx1].bit_cost_) - out[idx2].bit_cost_;
	if(out[idx1].total_count_ == 0) {
		p.cost_combo = out[idx2].bit_cost_;
		store_pair = true;
	} else if(out[idx2].total_count_ == 0) {
		p.cost_combo = out[idx1].bit_cost_;
		store_pair = true;
	} else {
		var threshold = pairs.size() == 0 ? 1e99 : Math.max(0.0,pairs.arr[0].cost_diff);
		var combo = new encode_histogram_Histogram(out[idx1].data_.length);
		combo.bit_cost_ = out[idx1].bit_cost_;
		var _g1 = 0;
		var _g = out[idx1].data_.length;
		while(_g1 < _g) {
			var a = _g1++;
			combo.data_[a] = out[idx1].data_[a];
		}
		combo.kDataSize = out[idx1].kDataSize;
		combo.total_count_ = out[idx1].total_count_;
		combo.AddHistogram(out[idx2]);
		var cost_combo = encode_Bit_$cost.PopulationCost(combo);
		if(cost_combo < threshold - p.cost_diff) {
			p.cost_combo = cost_combo;
			store_pair = true;
		}
	}
	if(store_pair) {
		p.cost_diff += p.cost_combo;
		pairs.push(p);
	}
};
encode_Cluster.HistogramCombine = function(out,cluster_size,symbols,symbols_off,symbols_size,max_clusters) {
	var cost_diff_threshold = 0.0;
	var min_cluster_size = 1;
	var all_symbols = [];
	var clusters = [];
	var _g1 = 0;
	while(_g1 < symbols_size) {
		var i = _g1++;
		if(all_symbols.indexOf(symbols[symbols_off + i]) == -1) {
			if(all_symbols.indexOf(symbols[symbols_off + i]) == -1) {
				all_symbols.push(symbols[symbols_off + i]);
			}
			clusters.push(symbols[symbols_off + i]);
		}
	}
	var pairs = new encode_BinaryHeap();
	var _g11 = 0;
	var _g = clusters.length;
	while(_g11 < _g) {
		var idx1 = _g11++;
		var _g3 = idx1 + 1;
		var _g2 = clusters.length;
		while(_g3 < _g2) encode_Cluster.CompareAndPushToHeap(out,cluster_size,clusters[idx1],clusters[_g3++],pairs);
	}
	while(clusters.length > min_cluster_size) {
		if(pairs.arr[0].cost_diff >= cost_diff_threshold) {
			cost_diff_threshold = 1e99;
			min_cluster_size = max_clusters;
			continue;
		}
		var best_idx1 = pairs.arr[0].idx1;
		var best_idx2 = pairs.arr[0].idx2;
		out[best_idx1].AddHistogram(out[best_idx2]);
		out[best_idx1].bit_cost_ = pairs.arr[0].cost_combo;
		cluster_size[best_idx1] = cluster_size[best_idx1] + cluster_size[best_idx2];
		var _g12 = 0;
		while(_g12 < symbols_size) {
			var i1 = _g12++;
			if(symbols[symbols_off + i1] == best_idx2) {
				symbols[symbols_off + i1] = best_idx1;
			}
		}
		var _g13 = 0;
		var _g4 = clusters.length;
		while(_g13 < _g4) {
			var i2 = _g13++;
			if(clusters[i2] >= best_idx2) {
				clusters[i2] = clusters[i2 + 1];
			}
		}
		clusters.pop();
		var _g14 = 0;
		var _g5 = pairs.size();
		while(_g14 < _g5) {
			var p = pairs.arr[_g14++];
			if(p.idx1 == best_idx1 || p.idx2 == best_idx1 || p.idx1 == best_idx2 || p.idx2 == best_idx2) {
				p.valid = false;
			}
		}
		while(pairs.size() != 0 && !pairs.arr[0].valid) pairs.pop();
		var _g15 = 0;
		var _g6 = clusters.length;
		while(_g15 < _g6) encode_Cluster.CompareAndPushToHeap(out,cluster_size,best_idx1,clusters[_g15++],pairs);
	}
};
encode_Cluster.HistogramBitCostDistance = function(histogram,candidate) {
	if(histogram.total_count_ == 0) {
		return 0.0;
	}
	var tmp = new encode_histogram_Histogram(histogram.data_.length);
	tmp.bit_cost_ = histogram.bit_cost_;
	var _g1 = 0;
	var _g = histogram.data_.length;
	while(_g1 < _g) {
		var a = _g1++;
		tmp.data_[a] = histogram.data_[a];
	}
	tmp.kDataSize = histogram.kDataSize;
	tmp.total_count_ = histogram.total_count_;
	tmp.AddHistogram(candidate);
	return encode_Bit_$cost.PopulationCost(tmp) - candidate.bit_cost_;
};
encode_Cluster.HistogramRemap = function(input,in_size,output,symbols) {
	var all_symbols = [];
	var _g1 = 0;
	while(_g1 < in_size) {
		var i = _g1++;
		if(all_symbols.indexOf(symbols[i]) == -1) {
			all_symbols.push(symbols[i]);
		}
	}
	var _g11 = 0;
	while(_g11 < in_size) {
		var i1 = _g11++;
		var best_out = i1 == 0 ? symbols[0] : symbols[i1 - 1];
		var best_bits = encode_Cluster.HistogramBitCostDistance(input[i1],output[best_out]);
		var _g3 = 0;
		var _g2 = all_symbols.length;
		while(_g3 < _g2) {
			var k = _g3++;
			var cur_bits = encode_Cluster.HistogramBitCostDistance(input[i1],output[all_symbols[k]]);
			if(cur_bits < best_bits) {
				best_bits = cur_bits;
				best_out = all_symbols[k];
			}
		}
		symbols[i1] = best_out;
	}
	var _g12 = 0;
	var _g = all_symbols.length;
	while(_g12 < _g) output[all_symbols[_g12++]].Clear();
	var _g13 = 0;
	while(_g13 < in_size) {
		var i2 = _g13++;
		output[symbols[i2]].AddHistogram(input[i2]);
	}
};
encode_Cluster.HistogramReindex = function(out,symbols) {
	var tmp = [];
	var _g1 = 0;
	var _g = out.length;
	while(_g1 < _g) {
		var i = _g1++;
		tmp[i] = new encode_histogram_Histogram(out[i].data_.length);
		tmp[i].bit_cost_ = out[i].bit_cost_;
		var _g3 = 0;
		var _g2 = out[i].data_.length;
		while(_g3 < _g2) {
			var a = _g3++;
			tmp[i].data_[a] = out[i].data_[a];
		}
		tmp[i].kDataSize = out[i].kDataSize;
		tmp[i].total_count_ = out[i].total_count_;
	}
	var new_index_h = { };
	var next_index = 0;
	var _g11 = 0;
	var _g4 = symbols.length;
	while(_g11 < _g4) {
		var i1 = _g11++;
		if(new_index_h.hasOwnProperty(symbols[i1]) == false) {
			new_index_h[symbols[i1]] = next_index;
			out[next_index].bit_cost_ = tmp[symbols[i1]].bit_cost_;
			var _g31 = 0;
			var _g21 = tmp[symbols[i1]].data_.length;
			while(_g31 < _g21) {
				var a1 = _g31++;
				out[next_index].data_[a1] = tmp[symbols[i1]].data_[a1];
			}
			out[next_index].kDataSize = tmp[symbols[i1]].kDataSize;
			out[next_index].total_count_ = tmp[symbols[i1]].total_count_;
			++next_index;
		}
	}
	while(out.length > next_index) out.pop();
	var _g12 = 0;
	var _g5 = symbols.length;
	while(_g12 < _g5) {
		var i2 = _g12++;
		symbols[i2] = new_index_h[symbols[i2]];
	}
};
encode_Cluster.ClusterHistograms = function(input,num_contexts,num_blocks,max_histograms,output,outputInt,histogram_symbols) {
	var in_size = num_contexts * num_blocks;
	var cluster_size = new Array(in_size);
	DefaultFunctions.memset_Int(cluster_size,0,1,in_size);
	while(output.length > in_size) output.pop();
	var _g1 = 0;
	var _g = in_size;
	while(_g1 < _g) output[_g1++] = new encode_histogram_Histogram(outputInt);
	var _g11 = 0;
	var _g2 = in_size;
	while(_g11 < _g2) {
		var i = _g11++;
		var _g3 = 0;
		var _g21 = input[i].data_.length;
		while(_g3 < _g21) {
			var a = _g3++;
			output[i].data_[a] = input[i].data_[a];
		}
		output[i].kDataSize = input[i].kDataSize;
		output[i].total_count_ = input[i].total_count_;
		output[i].bit_cost_ = encode_Bit_$cost.PopulationCost(input[i]);
		histogram_symbols[i] = i;
	}
	var max_input_histograms = 64;
	var i1 = 0;
	while(i1 < in_size) {
		encode_Cluster.HistogramCombine(output,cluster_size,histogram_symbols,i1,Math.min(in_size - i1,max_input_histograms) | 0,max_histograms);
		i1 += max_input_histograms;
	}
	encode_Cluster.HistogramCombine(output,cluster_size,histogram_symbols,0,in_size,max_histograms);
	encode_Cluster.HistogramRemap(input,in_size,output,histogram_symbols);
	encode_Cluster.HistogramReindex(output,histogram_symbols);
};
encode_Cluster.prototype = {
	__class__: encode_Cluster
};
var encode_Command_$functions = function() {
};
encode_Command_$functions.__name__ = true;
encode_Command_$functions.GetDistCode = function(distance_code,code,extra) {
	if(distance_code < 16) {
		code[0] = distance_code;
		extra[0] = 0;
	} else {
		distance_code -= 12;
		var numextra = encode_Fast_$log.Log2FloorNonZero(distance_code) - 1;
		var prefix = distance_code >> numextra;
		code[0] = 12 + 2 * numextra + prefix;
		extra[0] = numextra << 24 | distance_code - (prefix << numextra);
	}
};
encode_Command_$functions.GetInsertLengthCode = function(insertlen) {
	if(insertlen < 6) {
		return insertlen;
	} else if(insertlen < 130) {
		insertlen -= 2;
		var nbits = encode_Fast_$log.Log2FloorNonZero(insertlen) - 1;
		return (nbits << 1) + (insertlen >> nbits) + 2;
	} else if(insertlen < 2114) {
		return encode_Fast_$log.Log2FloorNonZero(insertlen - 66) + 10;
	} else if(insertlen < 6210) {
		return 21;
	} else if(insertlen < 22594) {
		return 22;
	} else {
		return 23;
	}
};
encode_Command_$functions.GetCopyLengthCode = function(copylen) {
	if(copylen < 10) {
		return copylen - 2;
	} else if(copylen < 134) {
		copylen -= 6;
		var nbits = encode_Fast_$log.Log2FloorNonZero(copylen) - 1;
		return (nbits << 1) + (copylen >> nbits) + 4;
	} else if(copylen < 2118) {
		return encode_Fast_$log.Log2FloorNonZero(copylen - 70) + 12;
	} else {
		return 23;
	}
};
encode_Command_$functions.CombineLengthCodes = function(inscode,copycode,distancecode) {
	var bits64 = copycode & 7 | (inscode & 7) << 3;
	if(distancecode == 0 && inscode < 8 && copycode < 16) {
		if(copycode < 8) {
			return bits64;
		} else {
			return bits64 | 64;
		}
	} else {
		return [2,3,6,4,5,8,7,9,10][(copycode >> 3) + 3 * (inscode >> 3)] << 6 | bits64;
	}
};
encode_Command_$functions.GetLengthCode = function(insertlen,copylen,distancecode,code,extra) {
	var inscode = encode_Command_$functions.GetInsertLengthCode(insertlen);
	var copycode = encode_Command_$functions.GetCopyLengthCode(copylen);
	var insnumextra = encode_Command_$functions.insextra[inscode];
	var numextra = insnumextra + encode_Command_$functions.copyextra[copycode];
	var insextraval = insertlen - encode_Command_$functions.insbase[inscode];
	var copyextraval = copylen - encode_Command_$functions.copybase[copycode];
	code[0] = encode_Command_$functions.CombineLengthCodes(inscode,copycode,distancecode);
	if(_$UInt_UInt_$Impl_$.gt(32,numextra)) {
		extra[0] = numextra << 16 | 0;
		extra[1] = copyextraval << insnumextra | insextraval;
	} else {
		var value = new haxe__$Int64__$_$_$Int64(0,0);
		var b;
		b = new haxe__$Int64__$_$_$Int64(new haxe__$Int64__$_$_$Int64(numextra >> 31,numextra).low << 16,0);
		var high = value.high + b.high | 0;
		var low = value.low + b.low | 0;
		if(haxe__$Int32_Int32_$Impl_$.ucompare(low,value.low) < 0) {
			++high;
			high = high | 0;
		}
		value = new haxe__$Int64__$_$_$Int64(high,low);
		var a = new haxe__$Int64__$_$_$Int64(copyextraval >> 31,copyextraval);
		var b1 = insnumextra;
		b1 &= 63;
		var b2 = b1 == 0 ? new haxe__$Int64__$_$_$Int64(a.high,a.low) : b1 < 32 ? new haxe__$Int64__$_$_$Int64(a.high << b1 | a.low >>> 32 - b1,a.low << b1) : new haxe__$Int64__$_$_$Int64(a.low << b1 - 32,0);
		var high1 = value.high + b2.high | 0;
		var low1 = value.low + b2.low | 0;
		if(haxe__$Int32_Int32_$Impl_$.ucompare(low1,value.low) < 0) {
			++high1;
			high1 = high1 | 0;
		}
		value = new haxe__$Int64__$_$_$Int64(high1,low1);
		var b3 = new haxe__$Int64__$_$_$Int64(insextraval >> 31,insextraval);
		var high2 = value.high + b3.high | 0;
		var low2 = value.low + b3.low | 0;
		if(haxe__$Int32_Int32_$Impl_$.ucompare(low2,value.low) < 0) {
			++high2;
			high2 = high2 | 0;
		}
		value = new haxe__$Int64__$_$_$Int64(high2,low2);
		var x = value.high;
		var x1 = new haxe__$Int64__$_$_$Int64(x >> 31,x);
		if(x1.high != x1.low >> 31) {
			throw new js__$Boot_HaxeError("Overflow");
		}
		extra[0] = x1.low;
		var x2 = value.low;
		var x3 = new haxe__$Int64__$_$_$Int64(x2 >> 31,x2);
		if(x3.high != x3.low >> 31) {
			throw new js__$Boot_HaxeError("Overflow");
		}
		extra[1] = x3.low;
	}
};
encode_Command_$functions.prototype = {
	__class__: encode_Command_$functions
};
var encode_Context = function() {
};
encode_Context.__name__ = true;
encode_Context.ContextFunction = function(p1,p2,mode) {
	switch(mode) {
	case 0:
		return p1 & 63;
	case 1:
		return p1 >>> 2;
	case 2:
		return encode_Context.kUTF8ContextLookup[p1] | encode_Context.kUTF8ContextLookup[p2 + 256];
	case 3:
		return (encode_Context.kSigned3BitContextLookup[p1] << 3) + encode_Context.kSigned3BitContextLookup[p2];
	default:
		return 0;
	}
};
encode_Context.prototype = {
	__class__: encode_Context
};
var encode_Dictionary = function() {
};
encode_Dictionary.__name__ = true;
encode_Dictionary.prototype = {
	__class__: encode_Dictionary
};
var encode_Dictionary_$hash = function() {
};
encode_Dictionary_$hash.__name__ = true;
encode_Dictionary_$hash.prototype = {
	__class__: encode_Dictionary_$hash
};
var encode_Encode = function() {
};
encode_Encode.__name__ = true;
encode_Encode.ParseAsUTF8 = function(symbol,input,input_off,size) {
	if((input[input_off] & 128) == 0) {
		symbol[0] = input[input_off];
		if(symbol[0] > 0) {
			return 1;
		}
	}
	if(size > 1 && (input[input_off] & 224) == 192 && (input[input_off + 1] & 192) == 128) {
		symbol[0] = (input[input_off] & 31) << 6 | input[input_off + 1] & 63;
		if(symbol[0] > 127) {
			return 2;
		}
	}
	if(size > 2 && (input[input_off] & 240) == 224 && (input[input_off + 1] & 192) == 128 && (input[input_off + 2] & 192) == 128) {
		symbol[0] = (input[input_off] & 15) << 12 | (input[input_off + 1] & 63) << 6 | input[input_off + 2] & 63;
		if(symbol[0] > 2047) {
			return 3;
		}
	}
	if(size > 3 && (input[input_off] & 248) == 240 && (input[input_off + 1] & 192) == 128 && (input[input_off + 2] & 192) == 128 && (input[input_off + 3] & 192) == 128) {
		symbol[0] = (input[input_off] & 7) << 18 | (input[input_off + 1] & 63) << 12 | (input[input_off + 2] & 63) << 6 | input[input_off + 3] & 63;
		if(symbol[0] > 65535 && symbol[0] <= 1114111) {
			return 4;
		}
	}
	symbol[0] = 1114112 | input[input_off];
	return 1;
};
encode_Encode.IsMostlyUTF8 = function(data,data_off,length,min_fraction) {
	var size_utf8 = 0;
	var pos = 0;
	while(pos < length) {
		var symbol = [];
		var bytes_read = encode_Encode.ParseAsUTF8(symbol,data,data_off + pos,length - pos);
		pos += bytes_read;
		if(symbol[0] < 1114112) {
			size_utf8 += bytes_read;
		}
	}
	return size_utf8 > min_fraction * length;
};
encode_Encode.RecomputeDistancePrefixes = function(cmds,num_commands,num_direct_distance_codes,distance_postfix_bits) {
	if(num_direct_distance_codes == 0 && distance_postfix_bits == 0) {
		return;
	}
	var _g1 = 0;
	while(_g1 < num_commands) {
		var cmd = cmds[_g1++];
		if(cmd.copy_len_ > 0 && _$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
			encode_Prefix.PrefixEncodeCopyDistance(cmd.DistanceCode(),num_direct_distance_codes,distance_postfix_bits,cmd.dist_prefix_,cmd.dist_extra_);
		}
	}
};
encode_Encode.DecideOverLiteralContextModeling = function(input,start_pos,length,mask,quality,literal_context_mode,num_literal_contexts,literal_context_map) {
	if(quality < encode_Encode.kMinQualityForContextModeling || length < 64) {
		return;
	}
	var end_pos = start_pos + length;
	while(start_pos + 64 < end_pos) {
		var stride_end_pos = start_pos + 64;
		var prev = input[start_pos & mask];
		var _g1 = start_pos + 1;
		while(_g1 < stride_end_pos) {
			var literal = input[_g1++ & mask];
			if(_$UInt_UInt_$Impl_$.gt(128,prev) && (literal & 192) == 128 || _$UInt_UInt_$Impl_$.gte(prev,192) && (literal & 192) != 128) {
				return;
			}
			prev = literal;
		}
		start_pos += 4096;
	}
	literal_context_mode[0] = 2;
	num_literal_contexts[0] = 2;
	literal_context_map[0] = [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
};
encode_Encode.CopyOneBlockToRingBuffer = function(r,compressor) {
	var block_size = compressor.input_block_size();
	var bytes_read = [0];
	var data = r.Read(block_size,bytes_read);
	if(data == null) {
		return 0;
	}
	compressor.CopyInputToRingBuffer(bytes_read[0],data);
	var remaining = block_size - bytes_read[0];
	while(remaining > 0) {
		var more_bytes_read = [0];
		data = r.Read(remaining,more_bytes_read);
		if(data == null) {
			break;
		}
		compressor.CopyInputToRingBuffer(more_bytes_read[0],data);
		bytes_read[0] = bytes_read[0] + more_bytes_read[0];
		remaining = remaining - more_bytes_read[0];
	}
	return bytes_read[0];
};
encode_Encode.BrotliInIsFinished = function(r) {
	var read_bytes = [];
	return r.Read(0,read_bytes) == null;
};
encode_Encode.BrotliCompress = function(params,input,output) {
	return encode_Encode.BrotliCompressWithCustomDictionary(0,null,params,input,output);
};
encode_Encode.BrotliCompressWithCustomDictionary = function(dictsize,dict,params,input,output) {
	var in_bytes = 0;
	var out_bytes = [0];
	var out = [];
	var final_block = false;
	var compressor = new encode_encode_BrotliCompressor(params);
	if(dictsize != 0) {
		compressor.BrotliSetCustomDictionary(dictsize,dict);
	}
	while(!final_block) {
		in_bytes = encode_Encode.CopyOneBlockToRingBuffer(input,compressor);
		if(in_bytes != 0) {
			final_block = encode_Encode.BrotliInIsFinished(input);
		} else {
			final_block = true;
		}
		out_bytes[0] = 0;
		if(!compressor.WriteBrotliData(final_block,false,out_bytes,out)) {
			return false;
		}
		if(out_bytes[0] > 0 && !output.Write(out[0],out_bytes[0])) {
			return false;
		}
	}
	return true;
};
encode_Encode.prototype = {
	__class__: encode_Encode
};
var encode_Entropy_$encode = function() {
};
encode_Entropy_$encode.__name__ = true;
encode_Entropy_$encode.EntropyCodeLiteral = function() {
	return new encode_entropy_$encode_EntropyCode(256);
};
encode_Entropy_$encode.EntropyCodeCommand = function() {
	return new encode_entropy_$encode_EntropyCode(704);
};
encode_Entropy_$encode.EntropyCodeDistance = function() {
	return new encode_entropy_$encode_EntropyCode(520);
};
encode_Entropy_$encode.EntropyCodeBlockLength = function() {
	return new encode_entropy_$encode_EntropyCode(26);
};
encode_Entropy_$encode.EntropyCodeContextMap = function() {
	return new encode_entropy_$encode_EntropyCode(272);
};
encode_Entropy_$encode.EntropyCodeBlockType = function() {
	return new encode_entropy_$encode_EntropyCode(258);
};
encode_Entropy_$encode.SortHuffmanTree = function(v0,v1) {
	if(v0.total_count_ == v1.total_count_) {
		return v1.index_right_or_value_ - v0.index_right_or_value_;
	}
	if(v0.total_count_ < v1.total_count_) {
		return -1;
	}
	return 1;
};
encode_Entropy_$encode.SetDepth = function(p,pool,pool_off,depth,depth_off,level) {
	if(p.index_left_ >= 0) {
		++level;
		encode_Entropy_$encode.SetDepth(pool[pool_off + p.index_left_],pool,pool_off,depth,depth_off,level);
		encode_Entropy_$encode.SetDepth(pool[pool_off + p.index_right_or_value_],pool,pool_off,depth,depth_off,level);
	} else {
		depth[depth_off + p.index_right_or_value_] = level;
	}
};
encode_Entropy_$encode.CreateHuffmanTree = function(data,data_off,length,tree_limit,depth,depth_off) {
	var count_limit = 1;
	while(true) {
		var tree = [];
		var tree_off = 0;
		var i = length - 1;
		while(i >= 0) {
			if(data[i] > 0) {
				var huffmantree = new encode_entropy_$encode_HuffmanTree();
				huffmantree.HuffmanTree3(Math.max(data[i],count_limit) | 0,-1,i);
				tree[tree_off++] = huffmantree;
			}
			--i;
		}
		var n = tree.length;
		if(n == 1) {
			depth[depth_off + tree[0].index_right_or_value_] = 1;
			break;
		}
		tree.sort(encode_Entropy_$encode.SortHuffmanTree);
		var huffmantree1 = new encode_entropy_$encode_HuffmanTree();
		huffmantree1.HuffmanTree3(2147483647,-1,-1);
		tree[tree_off++] = huffmantree1;
		var huffmantree2 = new encode_entropy_$encode_HuffmanTree();
		huffmantree2.HuffmanTree3(2147483647,-1,-1);
		tree[tree_off++] = huffmantree2;
		var i1 = 0;
		var j = n + 1;
		var k = n - 1;
		while(k > 0) {
			var left;
			var right;
			if(tree[i1].total_count_ <= tree[j].total_count_) {
				left = i1;
				++i1;
			} else {
				left = j;
				++j;
			}
			if(tree[i1].total_count_ <= tree[j].total_count_) {
				right = i1;
				++i1;
			} else {
				right = j;
				++j;
			}
			var j_end = tree.length - 1;
			tree[j_end].total_count_ = tree[left].total_count_ + tree[right].total_count_;
			tree[j_end].index_left_ = left;
			tree[j_end].index_right_or_value_ = right;
			var huffmantree3 = new encode_entropy_$encode_HuffmanTree();
			huffmantree3.HuffmanTree3(2147483647,-1,-1);
			tree[tree_off++] = huffmantree3;
			--k;
		}
		encode_Entropy_$encode.SetDepth(tree[2 * n - 1],tree,0,depth,depth_off,0);
		var max_element = 0;
		var _g1 = depth_off;
		var _g = depth_off + length;
		while(_g1 < _g) {
			var i2 = _g1++;
			if(_$UInt_UInt_$Impl_$.gt(depth[i2],max_element)) {
				max_element = depth[i2];
			}
		}
		if(max_element <= tree_limit) {
			break;
		}
		count_limit *= 2;
	}
};
encode_Entropy_$encode.Reverse = function(v,start,end) {
	--end;
	while(start < end) {
		var tmp = v[start];
		v[start] = v[end];
		v[end] = tmp;
		++start;
		--end;
	}
};
encode_Entropy_$encode.WriteHuffmanTreeRepetitions = function(previous_value,value,repetitions,tree,extra_bits_data) {
	if(previous_value != value) {
		tree.push(value);
		extra_bits_data.push(0);
		--repetitions;
	}
	if(repetitions == 7) {
		tree.push(value);
		extra_bits_data.push(0);
		--repetitions;
	}
	if(repetitions < 3) {
		var _g1 = 0;
		var _g = repetitions;
		while(_g1 < _g) {
			++_g1;
			tree.push(value);
			extra_bits_data.push(0);
		}
	} else {
		repetitions -= 3;
		var start = tree.length;
		while(repetitions >= 0) {
			tree.push(16);
			extra_bits_data.push(repetitions & 3);
			repetitions >>= 2;
			--repetitions;
		}
		encode_Entropy_$encode.Reverse(tree,start,tree.length);
		encode_Entropy_$encode.Reverse(extra_bits_data,start,tree.length);
	}
};
encode_Entropy_$encode.WriteHuffmanTreeRepetitionsZeros = function(repetitions,tree,extra_bits_data) {
	if(repetitions == 11) {
		tree.push(0);
		extra_bits_data.push(0);
		--repetitions;
	}
	if(repetitions < 3) {
		var _g1 = 0;
		var _g = repetitions;
		while(_g1 < _g) {
			++_g1;
			tree.push(0);
			extra_bits_data.push(0);
		}
	} else {
		repetitions -= 3;
		var start = tree.length;
		while(repetitions >= 0) {
			tree.push(17);
			extra_bits_data.push(repetitions & 7);
			repetitions >>= 3;
			--repetitions;
		}
		encode_Entropy_$encode.Reverse(tree,start,tree.length);
		encode_Entropy_$encode.Reverse(extra_bits_data,start,tree.length);
	}
};
encode_Entropy_$encode.OptimizeHuffmanCountsForRle = function(length,counts) {
	var nonzero_count = 0;
	var stride;
	var limit;
	var sum;
	var good_for_rle;
	var _g1 = 0;
	var _g = length;
	while(_g1 < _g) if(counts[_g1++] > 0) {
		++nonzero_count;
	}
	if(nonzero_count < 16) {
		return 1;
	}
	while(length >= 0) {
		if(length == 0) {
			return 1;
		}
		if(counts[length - 1] != 0) {
			break;
		}
		--length;
	}
	var nonzeros = 0;
	var smallest_nonzero = 1073741824;
	var _g11 = 0;
	var _g2 = length;
	while(_g11 < _g2) {
		var i = _g11++;
		if(counts[i] != 0) {
			++nonzeros;
			if(smallest_nonzero > counts[i]) {
				smallest_nonzero = counts[i];
			}
		}
	}
	if(nonzeros < 5) {
		return 1;
	}
	if(smallest_nonzero < 4) {
		if(length - nonzeros < 6) {
			var _g12 = 1;
			var _g3 = length - 1;
			while(_g12 < _g3) {
				var i1 = _g12++;
				if(counts[i1 - 1] != 0 && counts[i1] == 0 && counts[i1 + 1] != 0) {
					counts[i1] = 1;
				}
			}
		}
	}
	if(nonzeros < 28) {
		return 1;
	}
	good_for_rle = FunctionMalloc.mallocUInt(length);
	if(good_for_rle == null) {
		return 0;
	}
	var symbol = counts[0];
	var stride1 = 0;
	var _g13 = 0;
	var _g4 = length + 1;
	while(_g13 < _g4) {
		var i2 = _g13++;
		if(i2 == length || counts[i2] != symbol) {
			if(symbol == 0 && stride1 >= 5 || symbol != 0 && stride1 >= 7) {
				var _g31 = 0;
				var _g21 = stride1;
				while(_g31 < _g21) good_for_rle[i2 - _g31++ - 1] = 1;
			}
			stride1 = 1;
			if(i2 != length) {
				symbol = counts[i2];
			}
		} else {
			++stride1;
		}
	}
	stride = 0;
	limit = (256 * (counts[0] + counts[1] + counts[2]) / 3 | 0) + 420;
	sum = 0;
	var _g14 = 0;
	var _g5 = length + 1;
	while(_g14 < _g5) {
		var i3 = _g14++;
		if(i3 == length || _$UInt_UInt_$Impl_$.gt(good_for_rle[i3],0) || i3 != 0 && _$UInt_UInt_$Impl_$.gt(good_for_rle[i3 - 1],0) || Math.abs(256 * counts[i3] - limit) >= 1240) {
			if(stride >= 4 || stride >= 3 && sum == 0) {
				var count = (sum + (stride / 2 | 0)) / stride | 0;
				if(count < 1) {
					count = 1;
				}
				if(sum == 0) {
					count = 0;
				}
				var _g32 = 0;
				var _g22 = stride;
				while(_g32 < _g22) counts[i3 - _g32++ - 1] = count;
			}
			stride = 0;
			sum = 0;
			if(i3 < length - 2) {
				limit = (256 * (counts[i3] + counts[i3 + 1] + counts[i3 + 2]) / 3 | 0) + 420;
			} else if(i3 < length) {
				limit = 256 * counts[i3];
			} else {
				limit = 0;
			}
		}
		++stride;
		if(i3 != length) {
			sum += counts[i3];
			if(stride >= 4) {
				limit = (256 * sum + (stride / 2 | 0)) / stride | 0;
			}
			if(stride == 4) {
				limit += 120;
			}
		}
	}
	return 1;
};
encode_Entropy_$encode.DecideOverRleUse = function(depth,depth_off,length,use_rle_for_non_zero,use_rle_for_zero) {
	var total_reps_zero = 0;
	var total_reps_non_zero = 0;
	var count_reps_zero = 0;
	var count_reps_non_zero = 0;
	var i = 0;
	while(i < length) {
		var value = depth[depth_off + i];
		var reps = 1;
		var k = i + 1;
		while(k < length && depth[depth_off + k] == value) {
			++reps;
			++k;
		}
		if(reps >= 3 && value == 0) {
			total_reps_zero += reps;
			++count_reps_zero;
		}
		if(reps >= 4 && value != 0) {
			total_reps_non_zero += reps;
			++count_reps_non_zero;
		}
		i += reps;
	}
	total_reps_non_zero -= count_reps_non_zero * 2;
	total_reps_zero -= count_reps_zero * 2;
	use_rle_for_non_zero[0] = total_reps_non_zero > 2;
	use_rle_for_zero[0] = total_reps_zero > 2;
};
encode_Entropy_$encode.WriteHuffmanTree = function(depth,depth_off,length,tree,extra_bits_data) {
	var previous_value = 8;
	var new_length = length;
	var _g1 = 0;
	var _g = length;
	while(_g1 < _g) if(depth[depth_off + length - _g1++ - 1] == 0) {
		--new_length;
	} else {
		break;
	}
	var use_rle_for_non_zero = [false];
	var use_rle_for_zero = [false];
	if(_$UInt_UInt_$Impl_$.gt(length,50)) {
		encode_Entropy_$encode.DecideOverRleUse(depth,depth_off,new_length,use_rle_for_non_zero,use_rle_for_zero);
	}
	var i = 0;
	while(i < new_length) {
		var value = depth[depth_off + i];
		var reps = 1;
		if(value != 0 && use_rle_for_non_zero[0] || value == 0 && use_rle_for_zero[0]) {
			var k = i + 1;
			while(k < new_length && depth[depth_off + k] == value) {
				++reps;
				++k;
			}
		}
		if(value == 0) {
			encode_Entropy_$encode.WriteHuffmanTreeRepetitionsZeros(reps,tree,extra_bits_data);
		} else {
			encode_Entropy_$encode.WriteHuffmanTreeRepetitions(previous_value,value,reps,tree,extra_bits_data);
			previous_value = value;
		}
		i += reps;
	}
};
encode_Entropy_$encode.ReverseBits = function(num_bits,bits) {
	var kLut = [0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15];
	var retval = kLut[bits & 15];
	var i = 4;
	while(i < num_bits) {
		retval <<= 4;
		bits = bits >>> 4;
		retval |= kLut[bits & 15];
		i += 4;
	}
	retval >>= -num_bits & 3;
	return retval;
};
encode_Entropy_$encode.ConvertBitDepthsToSymbols = function(depth,depth_off,len,bits,bits_off) {
	var kMaxBits = 16;
	var bl_count = FunctionMalloc.mallocUInt(kMaxBits);
	var _g1 = 0;
	var _g = len;
	while(_g1 < _g) {
		var _g2 = depth[depth_off + _g1++];
		bl_count[_g2] = bl_count[_g2] + 1;
	}
	bl_count[0] = 0;
	var next_code = new Array(kMaxBits);
	next_code[0] = 0;
	var code = 0;
	var _g11 = 1;
	var _g3 = kMaxBits;
	while(_g11 < _g3) {
		var _bits = _g11++;
		code = code + bl_count[_bits - 1] << 1;
		next_code[_bits] = code;
	}
	var _g12 = 0;
	var _g4 = len;
	while(_g12 < _g4) {
		var i = _g12++;
		if(_$UInt_UInt_$Impl_$.gt(depth[depth_off + i],0)) {
			bits[bits_off + i] = encode_Entropy_$encode.ReverseBits(depth[depth_off + i],next_code[depth[depth_off + i]]);
			var _g21 = depth[depth_off + i];
			next_code[_g21] = next_code[_g21] + 1;
		}
	}
};
encode_Entropy_$encode.prototype = {
	__class__: encode_Entropy_$encode
};
var encode_Fast_$log = function() {
};
encode_Fast_$log.__name__ = true;
encode_Fast_$log.Log2Floor = function(n) {
	if(n == 0) {
		return -1;
	}
	var log = 0;
	var value = n;
	var i = 4;
	while(i >= 0) {
		var shift = 1 << i;
		var x = value >>> shift;
		if(x != 0) {
			value = x;
			log += shift;
		}
		--i;
	}
	return log;
};
encode_Fast_$log.Log2FloorNonZero = function(n) {
	var result = 0;
	while(true) {
		n = n >>> 1;
		if(!_$UInt_UInt_$Impl_$.gt(n,0)) {
			break;
		}
		++result;
	}
	return result;
};
encode_Fast_$log.FastLog2 = function(v) {
	if(v < 256) {
		return encode_Fast_$log.kLog2Table[v];
	}
	return Math.log(v) * 1.4426950408889634;
};
encode_Fast_$log.prototype = {
	__class__: encode_Fast_$log
};
var encode_Find_$match_$length = function() {
};
encode_Find_$match_$length.__name__ = true;
encode_Find_$match_$length.FindMatchLengthWithLimit = function(s1,s1_off,s2,s2_off,limit) {
	var matched = 0;
	var s2_limit_off = s2_off + limit;
	var s2_ptr_off = s2_off;
	while(true) {
		var tmp;
		if(s2_ptr_off <= s2_limit_off - 4) {
			var p_off = s1_off + matched;
			tmp = (s2[s2_ptr_off + 3] << 24 | s2[s2_ptr_off + 2] << 16 | s2[s2_ptr_off + 1] << 8 | s2[s2_ptr_off]) == (s1[p_off + 3] << 24 | s1[p_off + 2] << 16 | s1[p_off + 1] << 8 | s1[p_off]);
		} else {
			tmp = false;
		}
		if(!tmp) {
			break;
		}
		s2_ptr_off += 4;
		matched += 4;
	}
	while(s2_ptr_off < s2_limit_off && s1[s1_off + matched] == s2[s2_ptr_off]) {
		++s2_ptr_off;
		++matched;
	}
	return matched;
};
encode_Find_$match_$length.prototype = {
	__class__: encode_Find_$match_$length
};
var encode_Hash = function() {
};
encode_Hash.__name__ = true;
encode_Hash.Hash_ = function(kShiftBits,data,data_off) {
	return ((data[data_off + 3] << 24 | data[data_off + 2] << 16 | data[data_off + 1] << 8 | data[data_off]) * encode_Hash.kHashMul32 & -1) >>> 32 - kShiftBits;
};
encode_Hash.BackwardReferenceScore = function(copy_length,backward_reference_offset) {
	return 5.4 * copy_length - 1.20 * encode_Fast_$log.Log2Floor(backward_reference_offset);
};
encode_Hash.BackwardReferenceScoreUsingLastDistance = function(copy_length,distance_short_code) {
	return 5.4 * copy_length - [-0.6,0.95,1.17,1.27,0.93,0.93,0.96,0.96,0.99,0.99,1.05,1.05,1.15,1.15,1.25,1.25][distance_short_code];
};
encode_Hash.prototype = {
	__class__: encode_Hash
};
var encode_Histogram_$functions = function() {
};
encode_Histogram_$functions.__name__ = true;
encode_Histogram_$functions.HistogramLiteral = function() {
	return new encode_histogram_Histogram(256);
};
encode_Histogram_$functions.HistogramCommand = function() {
	return new encode_histogram_Histogram(704);
};
encode_Histogram_$functions.HistogramDistance = function() {
	return new encode_histogram_Histogram(520);
};
encode_Histogram_$functions.HistogramBlockLength = function() {
	return new encode_histogram_Histogram(26);
};
encode_Histogram_$functions.HistogramContextMap = function() {
	return new encode_histogram_Histogram(272);
};
encode_Histogram_$functions.HistogramBlockType = function() {
	return new encode_histogram_Histogram(258);
};
encode_Histogram_$functions.BuildHistograms = function(cmds,num_commands,literal_split,insert_and_copy_split,dist_split,ringbuffer,start_pos,mask,prev_byte,prev_byte2,context_modes,literal_histograms,insert_and_copy_histograms,copy_dist_histograms) {
	var pos = start_pos;
	var literal_it = new encode_block_$splitter_BlockSplitIterator(literal_split);
	var insert_and_copy_it = new encode_block_$splitter_BlockSplitIterator(insert_and_copy_split);
	var dist_it = new encode_block_$splitter_BlockSplitIterator(dist_split);
	var _g1 = 0;
	while(_g1 < num_commands) {
		var cmd = cmds[_g1++];
		insert_and_copy_it.Next();
		insert_and_copy_histograms[insert_and_copy_it.type_].Add1(cmd.cmd_prefix_[0]);
		var _g3 = 0;
		var _g2 = cmd.insert_len_;
		while(_g3 < _g2) {
			++_g3;
			literal_it.Next();
			literal_histograms[(literal_it.type_ << 6) + encode_Context.ContextFunction(prev_byte,prev_byte2,context_modes[literal_it.type_])].Add1(ringbuffer[pos & mask]);
			prev_byte2 = prev_byte;
			prev_byte = ringbuffer[pos & mask];
			++pos;
		}
		pos += cmd.copy_len_;
		if(cmd.copy_len_ > 0) {
			prev_byte2 = ringbuffer[pos - 2 & mask];
			prev_byte = ringbuffer[pos - 1 & mask];
			if(_$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
				dist_it.Next();
				copy_dist_histograms[(dist_it.type_ << 2) + cmd.DistanceContext()].Add1(cmd.dist_prefix_[0]);
			}
		}
	}
};
encode_Histogram_$functions.prototype = {
	__class__: encode_Histogram_$functions
};
var encode_Literal_$cost = function() {
};
encode_Literal_$cost.__name__ = true;
encode_Literal_$cost.UTF8Position = function(last,c,clamp) {
	if(c < 128) {
		return 0;
	} else if(c >= 192) {
		return Math.min(1,clamp) | 0;
	} else if(last < 224) {
		return 0;
	} else {
		return Math.min(2,clamp) | 0;
	}
};
encode_Literal_$cost.DecideMultiByteStatsLevel = function(pos,len,mask,data) {
	var counts = [0,0,0];
	var max_utf8 = 1;
	var last_c = 0;
	var utf8_pos = 0;
	var _g1 = 0;
	while(_g1 < len) {
		var c = data[pos + _g1++ & mask];
		utf8_pos = encode_Literal_$cost.UTF8Position(last_c,c,2);
		++counts[utf8_pos];
		last_c = c;
	}
	if(counts[2] < 500) {
		max_utf8 = 1;
	}
	if(counts[1] + counts[2] < 25) {
		max_utf8 = 0;
	}
	return max_utf8;
};
encode_Literal_$cost.EstimateBitCostsForLiteralsUTF8 = function(pos,len,mask,cost_mask,data,cost) {
	var max_utf8 = encode_Literal_$cost.DecideMultiByteStatsLevel(pos,len,mask,data);
	var histogram = [FunctionMalloc.mallocInt(256),FunctionMalloc.mallocInt(256),FunctionMalloc.mallocInt(256)];
	var in_window = Math.min(495,len) | 0;
	var in_window_utf8 = [0,0,0];
	var last_c = 0;
	var utf8_pos = 0;
	var _g1 = 0;
	while(_g1 < in_window) {
		var c = data[pos + _g1++ & mask];
		histogram[utf8_pos][c] = histogram[utf8_pos][c] + 1;
		++in_window_utf8[utf8_pos];
		utf8_pos = encode_Literal_$cost.UTF8Position(last_c,c,max_utf8);
		last_c = c;
	}
	var _g11 = 0;
	while(_g11 < len) {
		var i = _g11++;
		if(i - 495 >= 0) {
			var utf8_pos2 = encode_Literal_$cost.UTF8Position(i - 495 - 2 < 0 ? 0 : data[pos + i - 495 - 2 & mask],i - 495 - 1 < 0 ? 0 : data[pos + i - 495 - 1 & mask],max_utf8);
			var _g2 = data[pos + i - 495 & mask];
			histogram[utf8_pos2][_g2] = histogram[utf8_pos2][_g2] - 1;
			--in_window_utf8[utf8_pos2];
		}
		if(i + 495 < len) {
			var utf8_pos21 = encode_Literal_$cost.UTF8Position(i + 495 - 2 < 0 ? 0 : data[pos + i + 495 - 2 & mask],i + 495 - 1 < 0 ? 0 : data[pos + i + 495 - 1 & mask],max_utf8);
			var _g21 = data[pos + i + 495 & mask];
			histogram[utf8_pos21][_g21] = histogram[utf8_pos21][_g21] + 1;
			++in_window_utf8[utf8_pos21];
		}
		var utf8_pos1 = encode_Literal_$cost.UTF8Position(i < 2 ? 0 : data[pos + i - 2 & mask],i < 1 ? 0 : data[pos + i - 1 & mask],max_utf8);
		var histo = histogram[utf8_pos1][data[pos + i & mask]];
		if(histo == 0) {
			histo = 1;
		}
		var lit_cost = encode_Fast_$log.FastLog2(in_window_utf8[utf8_pos1]) - encode_Fast_$log.FastLog2(histo);
		lit_cost += 0.02905;
		if(lit_cost < 1.0) {
			lit_cost *= 0.5;
			lit_cost += 0.5;
		}
		if(i < 2000) {
			lit_cost += 0.7 - (2000 - i) / 2000.0 * 0.35;
		}
		cost[pos + i & cost_mask] = lit_cost;
	}
};
encode_Literal_$cost.EstimateBitCostsForLiterals = function(pos,len,mask,cost_mask,data,cost) {
	var histogram = FunctionMalloc.mallocInt(256);
	var in_window = Math.min(2000,len) | 0;
	var _g1 = 0;
	var _g = in_window;
	while(_g1 < _g) {
		var _g2 = data[pos + _g1++ & mask];
		histogram[_g2] = histogram[_g2] + 1;
	}
	var _g11 = 0;
	while(_g11 < len) {
		var i = _g11++;
		if(i - 2000 >= 0) {
			var _g21 = data[pos + i - 2000 & mask];
			histogram[_g21] = histogram[_g21] - 1;
			--in_window;
		}
		if(i + 2000 < len) {
			var _g22 = data[pos + i + 2000 & mask];
			histogram[_g22] = histogram[_g22] + 1;
			++in_window;
		}
		var histo = histogram[data[pos + i & mask]];
		if(histo == 0) {
			histo = 1;
		}
		var lit_cost = encode_Fast_$log.FastLog2(in_window) - encode_Fast_$log.FastLog2(histo);
		lit_cost += 0.029;
		if(lit_cost < 1.0) {
			lit_cost *= 0.5;
			lit_cost += 0.5;
		}
		cost[pos + i & cost_mask] = lit_cost;
	}
};
encode_Literal_$cost.prototype = {
	__class__: encode_Literal_$cost
};
var encode_Metablock = function() {
};
encode_Metablock.__name__ = true;
encode_Metablock.BuildMetaBlock = function(ringbuffer,pos,mask,prev_byte,prev_byte2,cmds,num_commands,literal_context_mode,mb) {
	encode_Block_$splitter.SplitBlock(cmds,num_commands,ringbuffer,pos & mask,mb.literal_split,mb.command_split,mb.distance_split);
	var literal_context_modes = [];
	var _g1 = 0;
	var _g = mb.literal_split.num_types;
	while(_g1 < _g) literal_context_modes[_g1++] = literal_context_mode;
	var num_literal_contexts = mb.literal_split.num_types << 6;
	var num_distance_contexts = mb.distance_split.num_types << 2;
	var literal_histograms = [];
	var _g11 = 0;
	var _g2 = num_literal_contexts;
	while(_g11 < _g2) {
		_g11++;
		literal_histograms.push(new encode_histogram_Histogram(encode_Histogram_$functions.HistogramLiteralInt));
	}
	mb.command_histograms = [];
	var _g12 = 0;
	var _g3 = mb.command_split.num_types;
	while(_g12 < _g3) {
		_g12++;
		mb.command_histograms.push(new encode_histogram_Histogram(encode_Histogram_$functions.HistogramCommandInt));
	}
	var distance_histograms = [];
	var _g13 = 0;
	var _g4 = num_distance_contexts;
	while(_g13 < _g4) {
		_g13++;
		distance_histograms.push(new encode_histogram_Histogram(encode_Histogram_$functions.HistogramDistanceInt));
	}
	encode_Histogram_$functions.BuildHistograms(cmds,num_commands,mb.literal_split,mb.command_split,mb.distance_split,ringbuffer,pos,mask,prev_byte,prev_byte2,literal_context_modes,literal_histograms,mb.command_histograms,distance_histograms);
	var kMaxNumberOfHistograms = 256;
	var _g14 = 0;
	var _g5 = literal_histograms.length;
	while(_g14 < _g5) {
		var i = _g14++;
		mb.literal_histograms[i] = new encode_histogram_Histogram(encode_Histogram_$functions.HistogramLiteralInt);
		mb.literal_histograms[i].bit_cost_ = literal_histograms[i].bit_cost_;
		var _g31 = 0;
		var _g21 = literal_histograms[i].data_.length;
		while(_g31 < _g21) {
			var a = _g31++;
			mb.literal_histograms[i].data_[a] = literal_histograms[i].data_[a];
		}
		mb.literal_histograms[i].kDataSize = literal_histograms[i].kDataSize;
		mb.literal_histograms[i].total_count_ = literal_histograms[i].total_count_;
	}
	var length = 64 * mb.literal_split.num_types;
	mb.literal_context_map = new Array(length);
	encode_Cluster.ClusterHistograms(literal_histograms,64,mb.literal_split.num_types,kMaxNumberOfHistograms,mb.literal_histograms,encode_Histogram_$functions.HistogramLiteralInt,mb.literal_context_map);
	var _g15 = 0;
	var _g6 = distance_histograms.length;
	while(_g15 < _g6) {
		var i1 = _g15++;
		mb.distance_histograms[i1] = new encode_histogram_Histogram(encode_Histogram_$functions.HistogramDistanceInt);
		mb.distance_histograms[i1].bit_cost_ = distance_histograms[i1].bit_cost_;
		var _g32 = 0;
		var _g22 = distance_histograms[i1].data_.length;
		while(_g32 < _g22) {
			var a1 = _g32++;
			mb.distance_histograms[i1].data_[a1] = distance_histograms[i1].data_[a1];
		}
		mb.distance_histograms[i1].kDataSize = distance_histograms[i1].kDataSize;
		mb.distance_histograms[i1].total_count_ = distance_histograms[i1].total_count_;
	}
	var length1 = 4 * mb.distance_split.num_types;
	mb.distance_context_map = new Array(length1);
	encode_Cluster.ClusterHistograms(distance_histograms,4,mb.distance_split.num_types,kMaxNumberOfHistograms,mb.distance_histograms,encode_Histogram_$functions.HistogramDistanceInt,mb.distance_context_map);
};
encode_Metablock.BuildMetaBlockGreedy = function(ringbuffer,pos,mask,commands,n_commands,mb) {
	var num_literals = 0;
	var _g1 = 0;
	while(_g1 < n_commands) num_literals += commands[_g1++].insert_len_;
	var lit_blocks = new encode_metablock_BlockSplitter(encode_Histogram_$functions.HistogramLiteralInt,256,512,400.0,num_literals,mb.literal_split,mb.literal_histograms);
	var cmd_blocks = new encode_metablock_BlockSplitter(encode_Histogram_$functions.HistogramCommandInt,704,1024,500.0,n_commands,mb.command_split,mb.command_histograms);
	var dist_blocks = new encode_metablock_BlockSplitter(encode_Histogram_$functions.HistogramDistanceInt,64,512,100.0,n_commands,mb.distance_split,mb.distance_histograms);
	var _g11 = 0;
	while(_g11 < n_commands) {
		var cmd = commands[_g11++];
		cmd_blocks.AddSymbol(cmd.cmd_prefix_[0]);
		var _g3 = 0;
		var _g2 = cmd.insert_len_;
		while(_g3 < _g2) {
			++_g3;
			lit_blocks.AddSymbol(ringbuffer[pos & mask]);
			++pos;
		}
		pos += cmd.copy_len_;
		if(cmd.copy_len_ > 0 && _$UInt_UInt_$Impl_$.gte(cmd.cmd_prefix_[0],128)) {
			dist_blocks.AddSymbol(cmd.dist_prefix_[0]);
		}
	}
	lit_blocks.FinishBlock(true);
	cmd_blocks.FinishBlock(true);
	dist_blocks.FinishBlock(true);
};
encode_Metablock.BuildMetaBlockGreedyWithContexts = function(ringbuffer,pos,mask,prev_byte,prev_byte2,literal_context_mode,num_contexts,static_context_map,commands,n_commands,mb) {
	var num_literals = 0;
	var _g1 = 0;
	while(_g1 < n_commands) num_literals += commands[_g1++].insert_len_;
	var lit_blocks = new encode_metablock_ContextBlockSplitter(encode_Histogram_$functions.HistogramLiteralInt,256,num_contexts,512,400.0,num_literals,mb.literal_split,mb.literal_histograms);
	var cmd_blocks = new encode_metablock_BlockSplitter(encode_Histogram_$functions.HistogramCommandInt,704,1024,500.0,n_commands,mb.command_split,mb.command_histograms);
	var dist_blocks = new encode_metablock_BlockSplitter(encode_Histogram_$functions.HistogramDistanceInt,64,512,100.0,n_commands,mb.distance_split,mb.distance_histograms);
	var _g11 = 0;
	while(_g11 < n_commands) {
		var cmd = commands[_g11++];
		cmd_blocks.AddSymbol(cmd.cmd_prefix_[0]);
		var _g3 = 0;
		var _g2 = cmd.insert_len_;
		while(_g3 < _g2) {
			++_g3;
			var literal = ringbuffer[pos & mask];
			lit_blocks.AddSymbol(literal,static_context_map[encode_Context.ContextFunction(prev_byte,prev_byte2,literal_context_mode)]);
			prev_byte2 = prev_byte;
			prev_byte = literal;
			++pos;
		}
		pos += cmd.copy_len_;
		if(cmd.copy_len_ > 0) {
			prev_byte2 = ringbuffer[pos - 2 & mask];
			prev_byte = ringbuffer[pos - 1 & mask];
			if(cmd.cmd_prefix_[0] >= 128) {
				dist_blocks.AddSymbol(cmd.dist_prefix_[0]);
			}
		}
	}
	lit_blocks.FinishBlock(true);
	cmd_blocks.FinishBlock(true);
	dist_blocks.FinishBlock(true);
	mb.literal_context_map = FunctionMalloc.mallocInt(mb.literal_split.num_types << 6);
	var _g12 = 0;
	var _g = mb.literal_split.num_types;
	while(_g12 < _g) {
		var i = _g12++;
		var _g31 = 0;
		while(_g31 < 64) {
			var j = _g31++;
			mb.literal_context_map[(i << 6) + j] = i * num_contexts + static_context_map[j];
		}
	}
};
encode_Metablock.OptimizeHistograms = function(num_direct_distance_codes,distance_postfix_bits,mb) {
	var _g1 = 0;
	var _g = mb.literal_histograms.length;
	while(_g1 < _g) encode_Entropy_$encode.OptimizeHuffmanCountsForRle(256,mb.literal_histograms[_g1++].data_);
	var _g11 = 0;
	var _g2 = mb.command_histograms.length;
	while(_g11 < _g2) encode_Entropy_$encode.OptimizeHuffmanCountsForRle(704,mb.command_histograms[_g11++].data_);
	var num_distance_codes = 16 + num_direct_distance_codes + (48 << distance_postfix_bits);
	var _g12 = 0;
	var _g3 = mb.distance_histograms.length;
	while(_g12 < _g3) encode_Entropy_$encode.OptimizeHuffmanCountsForRle(num_distance_codes,mb.distance_histograms[_g12++].data_);
};
encode_Metablock.prototype = {
	__class__: encode_Metablock
};
var encode_Port = function() {
};
encode_Port.__name__ = true;
encode_Port.BROTLI_UNALIGNED_LOAD32 = function(p,p_off) {
	return p[p_off + 3] << 24 | p[p_off + 2] << 16 | p[p_off + 1] << 8 | p[p_off];
};
encode_Port.PREDICT_FALSE = function(x) {
	return x;
};
encode_Port.PREDICT_TRUE = function(x) {
	return x;
};
encode_Port.prototype = {
	__class__: encode_Port
};
var encode_prefix_PrefixCodeRange = function(offset,nbits) {
	this.offset = offset;
	this.nbits = nbits;
};
encode_prefix_PrefixCodeRange.__name__ = true;
encode_prefix_PrefixCodeRange.prototype = {
	__class__: encode_prefix_PrefixCodeRange
};
var encode_Prefix = function() {
};
encode_Prefix.__name__ = true;
encode_Prefix.GetBlockLengthPrefixCode = function(len,code,code_off,n_extra,n_extra_off,extra,extra_off) {
	code[code_off] = 0;
	while(code[code_off] < 25 && len >= encode_Prefix.kBlockLengthPrefixCode[code[code_off] + 1].offset) code[code_off] = code[code_off] + 1;
	n_extra[n_extra_off] = encode_Prefix.kBlockLengthPrefixCode[code[code_off]].nbits;
	extra[extra_off] = len - encode_Prefix.kBlockLengthPrefixCode[code[code_off]].offset;
};
encode_Prefix.PrefixEncodeCopyDistance = function(distance_code,num_direct_codes,postfix_bits,code,extra_bits) {
	if(distance_code < 16 + num_direct_codes) {
		code[0] = distance_code;
		extra_bits[0] = 0;
		return;
	}
	distance_code -= 16 + num_direct_codes;
	distance_code += 1 << postfix_bits + 2;
	var bucket = encode_Fast_$log.Log2Floor(distance_code) - 1;
	var prefix = distance_code >> bucket & 1;
	var nbits = bucket - postfix_bits;
	code[0] = 16 + num_direct_codes + (2 * (nbits - 1) + prefix << postfix_bits) + (distance_code & (1 << postfix_bits) - 1);
	extra_bits[0] = nbits << 24 | distance_code - (2 + prefix << bucket) >> postfix_bits;
};
encode_Prefix.prototype = {
	__class__: encode_Prefix
};
var encode_RingBuffer = function(window_bits,tail_bits) {
	this.window_bits_ = window_bits;
	this.mask_ = (1 << window_bits) - 1;
	this.tail_size_ = 1 << tail_bits;
	this.pos_ = 0;
	var kSlackForFourByteHashingEverywhere = 3;
	var buflen = (1 << this.window_bits_) + this.tail_size_;
	this.buffer_ = new Array(buflen + kSlackForFourByteHashingEverywhere);
	var _g1 = 0;
	var _g = kSlackForFourByteHashingEverywhere;
	while(_g1 < _g) this.buffer_[buflen + _g1++] = 0;
};
encode_RingBuffer.__name__ = true;
encode_RingBuffer.prototype = {
	WriteTail: function(bytes,n) {
		var masked_pos = this.pos_ & this.mask_;
		if(masked_pos < this.tail_size_) {
			DefaultFunctions.memcpy_UInt(this.buffer_,(1 << this.window_bits_) + masked_pos,bytes,0,Math.min(n,this.tail_size_ - masked_pos) | 0);
		}
	}
	,Write: function(bytes,n) {
		var masked_pos = this.pos_ & this.mask_;
		this.WriteTail(bytes,n);
		if(masked_pos + n <= 1 << this.window_bits_) {
			DefaultFunctions.memcpy_UInt(this.buffer_,masked_pos,bytes,0,n);
		} else {
			DefaultFunctions.memcpy_UInt(this.buffer_,masked_pos,bytes,0,Math.min(n,(1 << this.window_bits_) + this.tail_size_ - masked_pos) | 0);
			DefaultFunctions.memcpy_UInt(this.buffer_,0,bytes,(1 << this.window_bits_) - masked_pos,n - ((1 << this.window_bits_) - masked_pos));
		}
		this.pos_ += n;
	}
	,position: function() {
		return this.pos_;
	}
	,mask: function() {
		return this.mask_;
	}
	,start: function() {
		return this.buffer_;
	}
	,__class__: encode_RingBuffer
};
var encode_Static_$dict = function() {
};
encode_Static_$dict.__name__ = true;
encode_Static_$dict.Hash_1 = function(data,data_off) {
	return (data[data_off + 3] << 24 | data[data_off + 2] << 16 | data[data_off + 1] << 8 | data[data_off]) * 506832829 >>> 0 >>> 17;
};
encode_Static_$dict.AddMatch = function(distance,len,len_code,matches) {
	matches[len] = Math.min(matches[len],(distance << 5) + len_code) | 0;
};
encode_Static_$dict.DictMatchLength = function(data,data_off,id,len) {
	return encode_Find_$match_$length.FindMatchLengthWithLimit(encode_Dictionary.kBrotliDictionary,encode_Dictionary.kBrotliDictionaryOffsetsByLength[len] + len * id,data,data_off,len);
};
encode_Static_$dict.IsMatch = function(w,data,data_off) {
	var offset = encode_Dictionary.kBrotliDictionaryOffsetsByLength[w.len] + w.len * w.idx;
	var dict = encode_Dictionary.kBrotliDictionary;
	if(w.transform == 0) {
		return encode_Find_$match_$length.FindMatchLengthWithLimit(dict,offset,data,data_off,w.len) == w.len;
	} else if(w.transform == 10) {
		var tmp;
		var tmp1;
		var tmp2 = HxOverrides.cca("a",0);
		if(_$UInt_UInt_$Impl_$.gte(dict[offset],tmp2)) {
			tmp1 = _$UInt_UInt_$Impl_$.gte(HxOverrides.cca("z",0),dict[offset]);
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			tmp = (dict[offset] ^ 32) == data[data_off];
		} else {
			tmp = false;
		}
		if(tmp) {
			return encode_Find_$match_$length.FindMatchLengthWithLimit(dict,offset + 1,data,data_off + 1,w.len - 1) == w.len - 1;
		} else {
			return false;
		}
	} else {
		var _g1 = 0;
		var _g = w.len;
		while(_g1 < _g) {
			var i = _g1++;
			var tmp3;
			var tmp4 = HxOverrides.cca("a",0);
			if(_$UInt_UInt_$Impl_$.gte(dict[offset + i],tmp4)) {
				tmp3 = _$UInt_UInt_$Impl_$.gte(HxOverrides.cca("z",0),dict[offset + i]);
			} else {
				tmp3 = false;
			}
			if(tmp3) {
				if((dict[offset + i] ^ 32) != data[data_off + i]) {
					return false;
				}
			} else if(dict[offset + i] != data[data_off + i]) {
				return false;
			}
		}
		return true;
	}
};
encode_Static_$dict.FindAllStaticDictionaryMatches = function(data,data_off,min_length,matches,matches_off) {
	var found_match = false;
	var key = encode_Static_$dict.Hash_1(data,data_off);
	var bucket = encode_Static_$dict_$lut.kStaticDictionaryBuckets[key];
	if(bucket != 0) {
		var num = bucket & 255;
		var offset = bucket >>> 8;
		var _g1 = 0;
		while(_g1 < num) {
			var w = encode_Static_$dict_$lut.kStaticDictionaryWords[offset + _g1++];
			var l = w.len;
			var n = 1 << encode_Dictionary.kBrotliDictionarySizeBitsByLength[l];
			var id = w.idx;
			if(w.transform == 0) {
				var matchlen = encode_Static_$dict.DictMatchLength(data,data_off,id,l);
				if(matchlen == l) {
					encode_Static_$dict.AddMatch(id,l,l,matches);
					found_match = true;
				}
				if(matchlen >= l - 1) {
					encode_Static_$dict.AddMatch(id + 12 * n,l - 1,l,matches);
					var tmp;
					var tmp1;
					var tmp2;
					var b = HxOverrides.cca("i",0);
					if(data[data_off + l - 1] == b) {
						var b1 = HxOverrides.cca("n",0);
						tmp2 = data[data_off + l] == b1;
					} else {
						tmp2 = false;
					}
					if(tmp2) {
						var b2 = HxOverrides.cca("g",0);
						tmp1 = data[data_off + l + 1] == b2;
					} else {
						tmp1 = false;
					}
					if(tmp1) {
						var b3 = HxOverrides.cca(" ",0);
						tmp = data[data_off + l + 2] == b3;
					} else {
						tmp = false;
					}
					if(tmp) {
						encode_Static_$dict.AddMatch(id + 49 * n,l + 3,l,matches);
					}
					found_match = true;
				}
				var _g3 = Math.max(min_length,l - 9) | 0;
				var _g2 = (Math.min(matchlen,l - 2) | 0) + 1;
				while(_g3 < _g2) {
					var len = _g3++;
					encode_Static_$dict.AddMatch(id + encode_Transform.kOmitLastNTransforms[l - len] * n,len,l,matches);
					found_match = true;
				}
				if(matchlen < l) {
					continue;
				}
				var s_off = data_off + l;
				var b4 = HxOverrides.cca(" ",0);
				if(data[s_off] == b4) {
					encode_Static_$dict.AddMatch(id + n,l + 1,l,matches);
					var b5 = HxOverrides.cca("a",0);
					if(data[s_off + 1] == b5) {
						var b6 = HxOverrides.cca(" ",0);
						if(data[s_off + 2] == b6) {
							encode_Static_$dict.AddMatch(id + 28 * n,l + 3,l,matches);
						} else {
							var b7 = HxOverrides.cca("s",0);
							if(data[s_off + 2] == b7) {
								var b8 = HxOverrides.cca(" ",0);
								if(data[s_off + 3] == b8) {
									encode_Static_$dict.AddMatch(id + 46 * n,l + 4,l,matches);
								}
							} else {
								var b9 = HxOverrides.cca("t",0);
								if(data[s_off + 2] == b9) {
									var b10 = HxOverrides.cca(" ",0);
									if(data[s_off + 3] == b10) {
										encode_Static_$dict.AddMatch(id + 60 * n,l + 4,l,matches);
									}
								} else {
									var b11 = HxOverrides.cca("n",0);
									if(data[s_off + 2] == b11) {
										var tmp3;
										var b12 = HxOverrides.cca("d",0);
										if(data[s_off + 3] == b12) {
											var b13 = HxOverrides.cca(" ",0);
											tmp3 = data[s_off + 4] == b13;
										} else {
											tmp3 = false;
										}
										if(tmp3) {
											encode_Static_$dict.AddMatch(id + 10 * n,l + 5,l,matches);
										}
									}
								}
							}
						}
					} else {
						var b14 = HxOverrides.cca("b",0);
						if(data[s_off + 1] == b14) {
							var tmp4;
							var b15 = HxOverrides.cca("y",0);
							if(data[s_off + 2] == b15) {
								var b16 = HxOverrides.cca(" ",0);
								tmp4 = data[s_off + 3] == b16;
							} else {
								tmp4 = false;
							}
							if(tmp4) {
								encode_Static_$dict.AddMatch(id + 38 * n,l + 4,l,matches);
							}
						} else {
							var b17 = HxOverrides.cca("i",0);
							if(data[s_off + 1] == b17) {
								var b18 = HxOverrides.cca("n",0);
								if(data[s_off + 2] == b18) {
									var b19 = HxOverrides.cca(" ",0);
									if(data[s_off + 3] == b19) {
										encode_Static_$dict.AddMatch(id + 16 * n,l + 4,l,matches);
									}
								} else {
									var b20 = HxOverrides.cca("s",0);
									if(data[s_off + 2] == b20) {
										var b21 = HxOverrides.cca(" ",0);
										if(data[s_off + 3] == b21) {
											encode_Static_$dict.AddMatch(id + 47 * n,l + 4,l,matches);
										}
									}
								}
							} else {
								var b22 = HxOverrides.cca("f",0);
								if(data[s_off + 1] == b22) {
									var b23 = HxOverrides.cca("o",0);
									if(data[s_off + 2] == b23) {
										var tmp5;
										var b24 = HxOverrides.cca("r",0);
										if(data[s_off + 3] == b24) {
											var b25 = HxOverrides.cca(" ",0);
											tmp5 = data[s_off + 4] == b25;
										} else {
											tmp5 = false;
										}
										if(tmp5) {
											encode_Static_$dict.AddMatch(id + 25 * n,l + 5,l,matches);
										}
									} else {
										var b26 = HxOverrides.cca("r",0);
										if(data[s_off + 2] == b26) {
											var tmp6;
											var tmp7;
											var b27 = HxOverrides.cca("o",0);
											if(data[s_off + 3] == b27) {
												var b28 = HxOverrides.cca("m",0);
												tmp7 = data[s_off + 4] == b28;
											} else {
												tmp7 = false;
											}
											if(tmp7) {
												var b29 = HxOverrides.cca(" ",0);
												tmp6 = data[s_off + 5] == b29;
											} else {
												tmp6 = false;
											}
											if(tmp6) {
												encode_Static_$dict.AddMatch(id + 37 * n,l + 6,l,matches);
											}
										}
									}
								} else {
									var b30 = HxOverrides.cca("o",0);
									if(data[s_off + 1] == b30) {
										var b31 = HxOverrides.cca("f",0);
										if(data[s_off + 2] == b31) {
											var b32 = HxOverrides.cca(" ",0);
											if(data[s_off + 3] == b32) {
												encode_Static_$dict.AddMatch(id + 8 * n,l + 4,l,matches);
											}
										} else {
											var b33 = HxOverrides.cca("n",0);
											if(data[s_off + 2] == b33) {
												var b34 = HxOverrides.cca(" ",0);
												if(data[s_off + 3] == b34) {
													encode_Static_$dict.AddMatch(id + 45 * n,l + 4,l,matches);
												}
											}
										}
									} else {
										var b35 = HxOverrides.cca("n",0);
										if(data[s_off + 1] == b35) {
											var tmp8;
											var tmp9;
											var b36 = HxOverrides.cca("o",0);
											if(data[s_off + 2] == b36) {
												var b37 = HxOverrides.cca("t",0);
												tmp9 = data[s_off + 3] == b37;
											} else {
												tmp9 = false;
											}
											if(tmp9) {
												var b38 = HxOverrides.cca(" ",0);
												tmp8 = data[s_off + 4] == b38;
											} else {
												tmp8 = false;
											}
											if(tmp8) {
												encode_Static_$dict.AddMatch(id + 80 * n,l + 5,l,matches);
											}
										} else {
											var b39 = HxOverrides.cca("t",0);
											if(data[s_off + 1] == b39) {
												var b40 = HxOverrides.cca("h",0);
												if(data[s_off + 2] == b40) {
													var b41 = HxOverrides.cca("e",0);
													if(data[s_off + 3] == b41) {
														var b42 = HxOverrides.cca(" ",0);
														if(data[s_off + 4] == b42) {
															encode_Static_$dict.AddMatch(id + 5 * n,l + 5,l,matches);
														}
													} else {
														var b43 = HxOverrides.cca("a",0);
														if(data[s_off + 3] == b43) {
															var tmp10;
															var b44 = HxOverrides.cca("t",0);
															if(data[s_off + 4] == b44) {
																var b45 = HxOverrides.cca(" ",0);
																tmp10 = data[s_off + 5] == b45;
															} else {
																tmp10 = false;
															}
															if(tmp10) {
																encode_Static_$dict.AddMatch(id + 29 * n,l + 6,l,matches);
															}
														}
													}
												} else {
													var b46 = HxOverrides.cca("o",0);
													if(data[s_off + 2] == b46) {
														var b47 = HxOverrides.cca(" ",0);
														if(data[s_off + 3] == b47) {
															encode_Static_$dict.AddMatch(id + 17 * n,l + 4,l,matches);
														}
													}
												}
											} else {
												var b48 = HxOverrides.cca("w",0);
												if(data[s_off + 1] == b48) {
													var tmp11;
													var tmp12;
													var tmp13;
													var b49 = HxOverrides.cca("i",0);
													if(data[s_off + 2] == b49) {
														var b50 = HxOverrides.cca("t",0);
														tmp13 = data[s_off + 3] == b50;
													} else {
														tmp13 = false;
													}
													if(tmp13) {
														var b51 = HxOverrides.cca("h",0);
														tmp12 = data[s_off + 4] == b51;
													} else {
														tmp12 = false;
													}
													if(tmp12) {
														var b52 = HxOverrides.cca(" ",0);
														tmp11 = data[s_off + 5] == b52;
													} else {
														tmp11 = false;
													}
													if(tmp11) {
														encode_Static_$dict.AddMatch(id + 35 * n,l + 6,l,matches);
													}
												}
											}
										}
									}
								}
							}
						}
					}
				} else {
					var b53 = HxOverrides.cca("\"",0);
					if(data[s_off] == b53) {
						encode_Static_$dict.AddMatch(id + 19 * n,l + 1,l,matches);
						var b54 = HxOverrides.cca(">",0);
						if(data[s_off + 1] == b54) {
							encode_Static_$dict.AddMatch(id + 21 * n,l + 2,l,matches);
						}
					} else {
						var b55 = HxOverrides.cca(".",0);
						if(data[s_off] == b55) {
							encode_Static_$dict.AddMatch(id + 20 * n,l + 1,l,matches);
							var b56 = HxOverrides.cca(" ",0);
							if(data[s_off + 1] == b56) {
								encode_Static_$dict.AddMatch(id + 31 * n,l + 2,l,matches);
								var tmp14;
								var b57 = HxOverrides.cca("T",0);
								if(data[s_off + 2] == b57) {
									var b58 = HxOverrides.cca("h",0);
									tmp14 = data[s_off + 3] == b58;
								} else {
									tmp14 = false;
								}
								if(tmp14) {
									var b59 = HxOverrides.cca("e",0);
									if(data[s_off + 4] == b59) {
										var b60 = HxOverrides.cca(" ",0);
										if(data[s_off + 5] == b60) {
											encode_Static_$dict.AddMatch(id + 43 * n,l + 6,l,matches);
										}
									} else {
										var b61 = HxOverrides.cca("i",0);
										if(data[s_off + 4] == b61) {
											var tmp15;
											var b62 = HxOverrides.cca("s",0);
											if(data[s_off + 5] == b62) {
												var b63 = HxOverrides.cca(" ",0);
												tmp15 = data[s_off + 6] == b63;
											} else {
												tmp15 = false;
											}
											if(tmp15) {
												encode_Static_$dict.AddMatch(id + 75 * n,l + 7,l,matches);
											}
										}
									}
								}
							}
						} else {
							var b64 = HxOverrides.cca(",",0);
							if(data[s_off] == b64) {
								encode_Static_$dict.AddMatch(id + 76 * n,l + 1,l,matches);
								var b65 = HxOverrides.cca(" ",0);
								if(data[s_off + 1] == b65) {
									encode_Static_$dict.AddMatch(id + 14 * n,l + 2,l,matches);
								}
							} else {
								var b66 = HxOverrides.cca("\n",0);
								if(data[s_off] == b66) {
									encode_Static_$dict.AddMatch(id + 22 * n,l + 1,l,matches);
									var b67 = HxOverrides.cca("\t",0);
									if(data[s_off + 1] == b67) {
										encode_Static_$dict.AddMatch(id + 50 * n,l + 2,l,matches);
									}
								} else {
									var b68 = HxOverrides.cca("]",0);
									if(data[s_off] == b68) {
										encode_Static_$dict.AddMatch(id + 24 * n,l + 1,l,matches);
									} else {
										var b69 = HxOverrides.cca("'",0);
										if(data[s_off] == b69) {
											encode_Static_$dict.AddMatch(id + 36 * n,l + 1,l,matches);
										} else {
											var b70 = HxOverrides.cca(":",0);
											if(data[s_off] == b70) {
												encode_Static_$dict.AddMatch(id + 51 * n,l + 1,l,matches);
											} else {
												var b71 = HxOverrides.cca("(",0);
												if(data[s_off] == b71) {
													encode_Static_$dict.AddMatch(id + 57 * n,l + 1,l,matches);
												} else {
													var b72 = HxOverrides.cca("=",0);
													if(data[s_off] == b72) {
														var b73 = HxOverrides.cca("\"",0);
														if(data[s_off + 1] == b73) {
															encode_Static_$dict.AddMatch(id + 70 * n,l + 2,l,matches);
														} else {
															var b74 = HxOverrides.cca("'",0);
															if(data[s_off + 1] == b74) {
																encode_Static_$dict.AddMatch(id + 86 * n,l + 2,l,matches);
															}
														}
													} else {
														var b75 = HxOverrides.cca("a",0);
														if(data[s_off] == b75) {
															var tmp16;
															var b76 = HxOverrides.cca("l",0);
															if(data[s_off + 1] == b76) {
																var b77 = HxOverrides.cca(" ",0);
																tmp16 = data[s_off + 2] == b77;
															} else {
																tmp16 = false;
															}
															if(tmp16) {
																encode_Static_$dict.AddMatch(id + 84 * n,l + 3,l,matches);
															}
														} else {
															var b78 = HxOverrides.cca("e",0);
															if(data[s_off] == b78) {
																var b79 = HxOverrides.cca("d",0);
																if(data[s_off + 1] == b79) {
																	var b80 = HxOverrides.cca(" ",0);
																	if(data[s_off + 2] == b80) {
																		encode_Static_$dict.AddMatch(id + 53 * n,l + 3,l,matches);
																	}
																} else {
																	var b81 = HxOverrides.cca("r",0);
																	if(data[s_off + 1] == b81) {
																		var b82 = HxOverrides.cca(" ",0);
																		if(data[s_off + 2] == b82) {
																			encode_Static_$dict.AddMatch(id + 82 * n,l + 3,l,matches);
																		}
																	} else {
																		var b83 = HxOverrides.cca("s",0);
																		if(data[s_off + 1] == b83) {
																			var tmp17;
																			var b84 = HxOverrides.cca("t",0);
																			if(data[s_off + 2] == b84) {
																				var b85 = HxOverrides.cca(" ",0);
																				tmp17 = data[s_off + 3] == b85;
																			} else {
																				tmp17 = false;
																			}
																			if(tmp17) {
																				encode_Static_$dict.AddMatch(id + 95 * n,l + 4,l,matches);
																			}
																		}
																	}
																}
															} else {
																var b86 = HxOverrides.cca("f",0);
																if(data[s_off] == b86) {
																	var tmp18;
																	var tmp19;
																	var b87 = HxOverrides.cca("u",0);
																	if(data[s_off + 1] == b87) {
																		var b88 = HxOverrides.cca("l",0);
																		tmp19 = data[s_off + 2] == b88;
																	} else {
																		tmp19 = false;
																	}
																	if(tmp19) {
																		var b89 = HxOverrides.cca(" ",0);
																		tmp18 = data[s_off + 3] == b89;
																	} else {
																		tmp18 = false;
																	}
																	if(tmp18) {
																		encode_Static_$dict.AddMatch(id + 90 * n,l + 4,l,matches);
																	}
																} else {
																	var b90 = HxOverrides.cca("i",0);
																	if(data[s_off] == b90) {
																		var b91 = HxOverrides.cca("v",0);
																		if(data[s_off + 1] == b91) {
																			var tmp20;
																			var b92 = HxOverrides.cca("e",0);
																			if(data[s_off + 2] == b92) {
																				var b93 = HxOverrides.cca(" ",0);
																				tmp20 = data[s_off + 3] == b93;
																			} else {
																				tmp20 = false;
																			}
																			if(tmp20) {
																				encode_Static_$dict.AddMatch(id + 92 * n,l + 4,l,matches);
																			}
																		} else {
																			var b94 = HxOverrides.cca("z",0);
																			if(data[s_off + 1] == b94) {
																				var tmp21;
																				var b95 = HxOverrides.cca("e",0);
																				if(data[s_off + 2] == b95) {
																					var b96 = HxOverrides.cca(" ",0);
																					tmp21 = data[s_off + 3] == b96;
																				} else {
																					tmp21 = false;
																				}
																				if(tmp21) {
																					encode_Static_$dict.AddMatch(id + 100 * n,l + 4,l,matches);
																				}
																			}
																		}
																	} else {
																		var b97 = HxOverrides.cca("l",0);
																		if(data[s_off] == b97) {
																			var b98 = HxOverrides.cca("e",0);
																			if(data[s_off + 1] == b98) {
																				var tmp22;
																				var tmp23;
																				var b99 = HxOverrides.cca("s",0);
																				if(data[s_off + 2] == b99) {
																					var b100 = HxOverrides.cca("s",0);
																					tmp23 = data[s_off + 3] == b100;
																				} else {
																					tmp23 = false;
																				}
																				if(tmp23) {
																					var b101 = HxOverrides.cca(" ",0);
																					tmp22 = data[s_off + 4] == b101;
																				} else {
																					tmp22 = false;
																				}
																				if(tmp22) {
																					encode_Static_$dict.AddMatch(id + 93 * n,l + 5,l,matches);
																				}
																			} else {
																				var b102 = HxOverrides.cca("y",0);
																				if(data[s_off + 1] == b102) {
																					var b103 = HxOverrides.cca(" ",0);
																					if(data[s_off + 2] == b103) {
																						encode_Static_$dict.AddMatch(id + 61 * n,l + 3,l,matches);
																					}
																				}
																			}
																		} else {
																			var b104 = HxOverrides.cca("o",0);
																			if(data[s_off] == b104) {
																				var tmp24;
																				var tmp25;
																				var b105 = HxOverrides.cca("u",0);
																				if(data[s_off + 1] == b105) {
																					var b106 = HxOverrides.cca("s",0);
																					tmp25 = data[s_off + 2] == b106;
																				} else {
																					tmp25 = false;
																				}
																				if(tmp25) {
																					var b107 = HxOverrides.cca(" ",0);
																					tmp24 = data[s_off + 3] == b107;
																				} else {
																					tmp24 = false;
																				}
																				if(tmp24) {
																					encode_Static_$dict.AddMatch(id + 106 * n,l + 4,l,matches);
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			} else {
				var t = w.transform - 10;
				if(!encode_Static_$dict.IsMatch(w,data,data_off)) {
					continue;
				}
				encode_Static_$dict.AddMatch(id + (t > 0 ? 44 : 9) * n,l,l,matches);
				found_match = true;
				var s_off1 = data_off + l;
				var b108 = HxOverrides.cca(" ",0);
				if(data[s_off1] == b108) {
					encode_Static_$dict.AddMatch(id + (t > 0 ? 68 : 4) * n,l + 1,l,matches);
				} else {
					var b109 = HxOverrides.cca("\"",0);
					if(data[s_off1] == b109) {
						encode_Static_$dict.AddMatch(id + (t > 0 ? 87 : 66) * n,l + 1,l,matches);
						var b110 = HxOverrides.cca(">",0);
						if(data[s_off1 + 1] == b110) {
							encode_Static_$dict.AddMatch(id + (t > 0 ? 97 : 69) * n,l + 2,l,matches);
						}
					} else {
						var b111 = HxOverrides.cca(".",0);
						if(data[s_off1] == b111) {
							encode_Static_$dict.AddMatch(id + (t > 0 ? 101 : 79) * n,l + 1,l,matches);
							var b112 = HxOverrides.cca(" ",0);
							if(data[s_off1 + 1] == b112) {
								encode_Static_$dict.AddMatch(id + (t > 0 ? 114 : 88) * n,l + 2,l,matches);
							}
						} else {
							var b113 = HxOverrides.cca(",",0);
							if(data[s_off1] == b113) {
								encode_Static_$dict.AddMatch(id + (t > 0 ? 112 : 99) * n,l + 1,l,matches);
								var b114 = HxOverrides.cca(" ",0);
								if(data[s_off1 + 1] == b114) {
									encode_Static_$dict.AddMatch(id + (t > 0 ? 107 : 58) * n,l + 2,l,matches);
								}
							} else {
								var b115 = HxOverrides.cca("'",0);
								if(data[s_off1] == b115) {
									encode_Static_$dict.AddMatch(id + (t > 0 ? 94 : 74) * n,l + 1,l,matches);
								} else {
									var b116 = HxOverrides.cca("(",0);
									if(data[s_off1] == b116) {
										encode_Static_$dict.AddMatch(id + (t > 0 ? 113 : 78) * n,l + 1,l,matches);
									} else {
										var b117 = HxOverrides.cca("=",0);
										if(data[s_off1] == b117) {
											var b118 = HxOverrides.cca("\"",0);
											if(data[s_off1 + 1] == b118) {
												encode_Static_$dict.AddMatch(id + (t > 0 ? 105 : 104) * n,l + 2,l,matches);
											} else {
												var b119 = HxOverrides.cca("'",0);
												if(data[s_off1 + 1] == b119) {
													encode_Static_$dict.AddMatch(id + (t > 0 ? 116 : 108) * n,l + 2,l,matches);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	var tmp26;
	var b120 = HxOverrides.cca(" ",0);
	if(data[data_off] != b120) {
		var b121 = HxOverrides.cca(".",0);
		tmp26 = data[data_off] == b121;
	} else {
		tmp26 = true;
	}
	if(tmp26) {
		var b122 = HxOverrides.cca(" ",0);
		var is_space = data[data_off] == b122;
		key = encode_Static_$dict.Hash_1(data,data_off + 1);
		bucket = encode_Static_$dict_$lut.kStaticDictionaryBuckets[key];
		var num1 = bucket & 255;
		var offset1 = bucket >>> 8;
		var _g11 = 0;
		while(_g11 < num1) {
			var w1 = encode_Static_$dict_$lut.kStaticDictionaryWords[offset1 + _g11++];
			var l1 = w1.len;
			var n1 = 1 << encode_Dictionary.kBrotliDictionarySizeBitsByLength[l1];
			var id1 = w1.idx;
			if(w1.transform == 0) {
				if(!encode_Static_$dict.IsMatch(w1,data,data_off + 1)) {
					continue;
				}
				encode_Static_$dict.AddMatch(id1 + (is_space ? 6 : 32) * n1,l1 + 1,l1,matches);
				found_match = true;
				var s_off2 = data_off + l1 + 1;
				var b123 = HxOverrides.cca(" ",0);
				if(data[s_off2] == b123) {
					encode_Static_$dict.AddMatch(id1 + (is_space ? 2 : 77) * n1,l1 + 2,l1,matches);
				} else {
					var b124 = HxOverrides.cca("(",0);
					if(data[s_off2] == b124) {
						encode_Static_$dict.AddMatch(id1 + (is_space ? 89 : 67) * n1,l1 + 2,l1,matches);
					} else if(is_space) {
						var b125 = HxOverrides.cca(",",0);
						if(data[s_off2] == b125) {
							encode_Static_$dict.AddMatch(id1 + 103 * n1,l1 + 2,l1,matches);
							var b126 = HxOverrides.cca(" ",0);
							if(data[s_off2 + 1] == b126) {
								encode_Static_$dict.AddMatch(id1 + 33 * n1,l1 + 3,l1,matches);
							}
						} else {
							var b127 = HxOverrides.cca(".",0);
							if(data[s_off2] == b127) {
								encode_Static_$dict.AddMatch(id1 + 71 * n1,l1 + 2,l1,matches);
								var b128 = HxOverrides.cca(" ",0);
								if(data[s_off2 + 1] == b128) {
									encode_Static_$dict.AddMatch(id1 + 52 * n1,l1 + 3,l1,matches);
								}
							} else {
								var b129 = HxOverrides.cca("=",0);
								if(data[s_off2] == b129) {
									var b130 = HxOverrides.cca("\"",0);
									if(data[s_off2 + 1] == b130) {
										encode_Static_$dict.AddMatch(id1 + 81 * n1,l1 + 3,l1,matches);
									} else {
										var b131 = HxOverrides.cca("'",0);
										if(data[s_off2 + 1] == b131) {
											encode_Static_$dict.AddMatch(id1 + 98 * n1,l1 + 3,l1,matches);
										}
									}
								}
							}
						}
					}
				}
			} else if(is_space) {
				var t1 = w1.transform - 10;
				if(!encode_Static_$dict.IsMatch(w1,data,data_off + 1)) {
					continue;
				}
				encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 85 : 30) * n1,l1 + 1,l1,matches);
				found_match = true;
				var s_off3 = data_off + l1 + 1;
				var b132 = HxOverrides.cca(" ",0);
				if(data[s_off3] == b132) {
					encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 83 : 15) * n1,l1 + 2,l1,matches);
				} else {
					var b133 = HxOverrides.cca(",",0);
					if(data[s_off3] == b133) {
						if(t1 == 0) {
							encode_Static_$dict.AddMatch(id1 + 109 * n1,l1 + 2,l1,matches);
						}
						var b134 = HxOverrides.cca(" ",0);
						if(data[s_off3 + 1] == b134) {
							encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 111 : 65) * n1,l1 + 3,l1,matches);
						}
					} else {
						var b135 = HxOverrides.cca(".",0);
						if(data[s_off3] == b135) {
							encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 115 : 96) * n1,l1 + 2,l1,matches);
							var b136 = HxOverrides.cca(" ",0);
							if(data[s_off3 + 1] == b136) {
								encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 117 : 91) * n1,l1 + 3,l1,matches);
							}
						} else {
							var b137 = HxOverrides.cca("=",0);
							if(data[s_off3] == b137) {
								var b138 = HxOverrides.cca("\"",0);
								if(data[s_off3 + 1] == b138) {
									encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 110 : 118) * n1,l1 + 3,l1,matches);
								} else {
									var b139 = HxOverrides.cca("'",0);
									if(data[s_off3 + 1] == b139) {
										encode_Static_$dict.AddMatch(id1 + (t1 > 0 ? 119 : 120) * n1,l1 + 3,l1,matches);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	var tmp27;
	var tmp28;
	var b140 = HxOverrides.cca(" ",0);
	if(data[data_off + 1] == b140) {
		var tmp29;
		var b141 = HxOverrides.cca("e",0);
		if(data[data_off] != b141) {
			var b142 = HxOverrides.cca("s",0);
			tmp29 = data[data_off] == b142;
		} else {
			tmp29 = true;
		}
		if(!tmp29) {
			var b143 = HxOverrides.cca(",",0);
			tmp28 = data[data_off] == b143;
		} else {
			tmp28 = true;
		}
	} else {
		tmp28 = false;
	}
	if(!tmp28) {
		if(data[data_off] == 194) {
			tmp27 = data[data_off + 1] == 160;
		} else {
			tmp27 = false;
		}
	} else {
		tmp27 = true;
	}
	if(tmp27) {
		key = encode_Static_$dict.Hash_1(data,data_off + 2);
		bucket = encode_Static_$dict_$lut.kStaticDictionaryBuckets[key];
		var num2 = bucket & 255;
		var offset2 = bucket >>> 8;
		var _g12 = 0;
		while(_g12 < num2) {
			var w2 = encode_Static_$dict_$lut.kStaticDictionaryWords[offset2 + _g12++];
			var l2 = w2.len;
			var n2 = 1 << encode_Dictionary.kBrotliDictionarySizeBitsByLength[l2];
			var id2 = w2.idx;
			if(w2.transform == 0 && encode_Static_$dict.IsMatch(w2,data,data_off + 2)) {
				if(data[data_off] == 194) {
					encode_Static_$dict.AddMatch(id2 + 102 * n2,l2 + 2,l2,matches);
					found_match = true;
				} else {
					var b144 = HxOverrides.cca(" ",0);
					if(data[data_off + l2 + 2] == b144) {
						var t2;
						var b145 = HxOverrides.cca("e",0);
						if(data[data_off] == b145) {
							t2 = 18;
						} else {
							var b146 = HxOverrides.cca("s",0);
							if(data[data_off] == b146) {
								t2 = 7;
							} else {
								t2 = 13;
							}
						}
						encode_Static_$dict.AddMatch(id2 + t2 * n2,l2 + 3,l2,matches);
						found_match = true;
					}
				}
			}
		}
	}
	var tmp30;
	var tmp31;
	var tmp32;
	var tmp33;
	var tmp34;
	var b147 = HxOverrides.cca(" ",0);
	if(data[data_off] == b147) {
		var b148 = HxOverrides.cca("t",0);
		tmp34 = data[data_off + 1] == b148;
	} else {
		tmp34 = false;
	}
	if(tmp34) {
		var b149 = HxOverrides.cca("h",0);
		tmp33 = data[data_off + 2] == b149;
	} else {
		tmp33 = false;
	}
	if(tmp33) {
		var b150 = HxOverrides.cca("e",0);
		tmp32 = data[data_off + 3] == b150;
	} else {
		tmp32 = false;
	}
	if(tmp32) {
		var b151 = HxOverrides.cca(" ",0);
		tmp31 = data[data_off + 4] == b151;
	} else {
		tmp31 = false;
	}
	if(!tmp31) {
		var tmp35;
		var tmp36;
		var tmp37;
		var b152 = HxOverrides.cca(".",0);
		if(data[data_off] == b152) {
			var b153 = HxOverrides.cca("c",0);
			tmp37 = data[data_off + 1] == b153;
		} else {
			tmp37 = false;
		}
		if(tmp37) {
			var b154 = HxOverrides.cca("o",0);
			tmp36 = data[data_off + 2] == b154;
		} else {
			tmp36 = false;
		}
		if(tmp36) {
			var b155 = HxOverrides.cca("m",0);
			tmp35 = data[data_off + 3] == b155;
		} else {
			tmp35 = false;
		}
		if(tmp35) {
			var b156 = HxOverrides.cca("/",0);
			tmp30 = data[data_off + 4] == b156;
		} else {
			tmp30 = false;
		}
	} else {
		tmp30 = true;
	}
	if(tmp30) {
		key = encode_Static_$dict.Hash_1(data,data_off + 5);
		bucket = encode_Static_$dict_$lut.kStaticDictionaryBuckets[key];
		var num3 = bucket & 255;
		var offset3 = bucket >>> 8;
		var _g13 = 0;
		while(_g13 < num3) {
			var w3 = encode_Static_$dict_$lut.kStaticDictionaryWords[offset3 + _g13++];
			var l3 = w3.len;
			var n3 = 1 << encode_Dictionary.kBrotliDictionarySizeBitsByLength[l3];
			var id3 = w3.idx;
			if(w3.transform == 0 && encode_Static_$dict.IsMatch(w3,data,data_off + 5)) {
				var tmp38;
				var b157 = HxOverrides.cca(" ",0);
				if(data[data_off] == b157) {
					tmp38 = 41;
				} else {
					tmp38 = 72;
				}
				encode_Static_$dict.AddMatch(id3 + tmp38 * n3,l3 + 5,l3,matches);
				found_match = true;
				var s_off4 = data_off + l3 + 5;
				var b158 = HxOverrides.cca(" ",0);
				if(data[data_off] == b158) {
					var tmp39;
					var tmp40;
					var tmp41;
					var b159 = HxOverrides.cca(" ",0);
					if(data[s_off4] == b159) {
						var b160 = HxOverrides.cca("o",0);
						tmp41 = data[s_off4 + 1] == b160;
					} else {
						tmp41 = false;
					}
					if(tmp41) {
						var b161 = HxOverrides.cca("f",0);
						tmp40 = data[s_off4 + 2] == b161;
					} else {
						tmp40 = false;
					}
					if(tmp40) {
						var b162 = HxOverrides.cca(" ",0);
						tmp39 = data[s_off4 + 3] == b162;
					} else {
						tmp39 = false;
					}
					if(tmp39) {
						encode_Static_$dict.AddMatch(id3 + 62 * n3,l3 + 9,l3,matches);
						var tmp42;
						var tmp43;
						var tmp44;
						var b163 = HxOverrides.cca("t",0);
						if(data[s_off4 + 4] == b163) {
							var b164 = HxOverrides.cca("h",0);
							tmp44 = data[s_off4 + 5] == b164;
						} else {
							tmp44 = false;
						}
						if(tmp44) {
							var b165 = HxOverrides.cca("e",0);
							tmp43 = data[s_off4 + 6] == b165;
						} else {
							tmp43 = false;
						}
						if(tmp43) {
							var b166 = HxOverrides.cca(" ",0);
							tmp42 = data[s_off4 + 7] == b166;
						} else {
							tmp42 = false;
						}
						if(tmp42) {
							encode_Static_$dict.AddMatch(id3 + 73 * n3,l3 + 13,l3,matches);
						}
					}
				}
			}
		}
	}
	return found_match;
};
encode_Static_$dict.prototype = {
	__class__: encode_Static_$dict
};
var encode_Static_$dict_$lut = function() {
};
encode_Static_$dict_$lut.__name__ = true;
encode_Static_$dict_$lut.prototype = {
	__class__: encode_Static_$dict_$lut
};
var encode_Transform = function() {
};
encode_Transform.__name__ = true;
encode_Transform.prototype = {
	__class__: encode_Transform
};
var encode_Write_$bits = function() {
};
encode_Write_$bits.__name__ = true;
encode_Write_$bits.WriteBits = function(n_bits,bits,pos,array) {
	var array_pos_off = pos[0] >> 3;
	var bits_reserved_in_first_byte = pos[0] & 7;
	bits = bits << bits_reserved_in_first_byte;
	var _g = array_pos_off++;
	array[_g] = array[_g] | bits & 255;
	var bits_left_to_write = n_bits - 8 + bits_reserved_in_first_byte;
	while(bits_left_to_write >= 1) {
		bits = bits >>> 8;
		array[array_pos_off++] = bits & 255;
		bits_left_to_write -= 8;
	}
	array[array_pos_off] = 0;
	pos[0] += n_bits;
};
encode_Write_$bits.WriteBitsPrepareStorage = function(pos,array) {
	array[pos >> 3] = 0;
};
encode_Write_$bits.prototype = {
	__class__: encode_Write_$bits
};
var encode_backward_$references_Pair = function(first,second) {
	this.first = first;
	this.second = second;
};
encode_backward_$references_Pair.__name__ = true;
encode_backward_$references_Pair.prototype = {
	__class__: encode_backward_$references_Pair
};
var encode_backward_$references_StartPosQueue = function(bits) {
	this.mask_ = (1 << bits) - 1;
	this.q_ = FunctionMalloc.malloc2__encode_backward_references_Pair(encode_backward_$references_Pair,1 << bits);
	this.idx_ = 0;
};
encode_backward_$references_StartPosQueue.__name__ = true;
encode_backward_$references_StartPosQueue.prototype = {
	Clear: function() {
		this.idx_ = 0;
	}
	,Push: function(pos,costdiff) {
		this.q_[this.idx_ & this.mask_] = new encode_backward_$references_Pair(pos,costdiff);
		var i = this.idx_;
		while(i > 0 && i > this.idx_ - this.mask_) {
			if(this.q_[i & this.mask_].second > this.q_[i - 1 & this.mask_].second) {
				var t1 = this.q_[i & this.mask_].first;
				var t2 = this.q_[i & this.mask_].second;
				this.q_[i & this.mask_].first = this.q_[i - 1 & this.mask_].first;
				this.q_[i & this.mask_].second = this.q_[i - 1 & this.mask_].second;
				this.q_[i - 1 & this.mask_].first = t1;
				this.q_[i - 1 & this.mask_].second = t2;
			}
			--i;
		}
		++this.idx_;
	}
	,size: function() {
		return Math.min(this.idx_,this.mask_ + 1) | 0;
	}
	,GetStartPos: function(k) {
		return this.q_[this.idx_ - k - 1 & this.mask_].first;
	}
	,__class__: encode_backward_$references_StartPosQueue
};
var encode_backward_$references_ZopfliCostModel = function() {
};
encode_backward_$references_ZopfliCostModel.__name__ = true;
encode_backward_$references_ZopfliCostModel.prototype = {
	SetFromCommands: function(num_bytes,position,ringbuffer,ringbuffer_mask,commands,num_commands,last_insert_len) {
		var histogram_literal = FunctionMalloc.mallocInt(256);
		var histogram_cmd = FunctionMalloc.mallocInt(704);
		var histogram_dist = FunctionMalloc.mallocInt(520);
		var pos = position - last_insert_len;
		var _g1 = 0;
		var _g = num_commands;
		while(_g1 < _g) {
			var i = _g1++;
			var inslength = commands[i].insert_len_;
			var copylength = commands[i].copy_len_;
			var distcode = commands[i].dist_prefix_[0];
			var cmdcode = commands[i].cmd_prefix_[0];
			var _g2 = cmdcode;
			histogram_cmd[_g2] = histogram_cmd[_g2] + 1;
			if(cmdcode >= 128) {
				var _g21 = distcode;
				histogram_dist[_g21] = histogram_dist[_g21] + 1;
			}
			var _g3 = 0;
			var _g22 = inslength;
			while(_g3 < _g22) {
				var _g4 = ringbuffer[pos + _g3++ & ringbuffer_mask];
				histogram_literal[_g4] = histogram_literal[_g4] + 1;
			}
			pos += inslength + copylength;
		}
		var cost_literal_ = [];
		this.Set(histogram_literal,cost_literal_);
		var cost_literal = cost_literal_[0];
		var cost_cmd = [this.cost_cmd_];
		this.Set(histogram_cmd,cost_cmd);
		this.cost_cmd_ = cost_cmd[0];
		var cost_dist = [this.cost_dist_];
		this.Set(histogram_dist,cost_dist);
		this.cost_dist_ = cost_dist[0];
		this.min_cost_cmd_ = encode_Backward_$references.kInfinity;
		var _g5 = 0;
		while(_g5 < 704) this.min_cost_cmd_ = Math.min(this.min_cost_cmd_,this.cost_cmd_[_g5++]);
		this.literal_costs_ = new Array(num_bytes + 1);
		this.literal_costs_[0] = 0.0;
		var _g11 = 0;
		var _g6 = num_bytes;
		while(_g11 < _g6) {
			var i1 = _g11++;
			this.literal_costs_[i1 + 1] = this.literal_costs_[i1] + cost_literal[ringbuffer[position + i1 & ringbuffer_mask]];
		}
	}
	,SetFromLiteralCosts: function(num_bytes,position,literal_cost,literal_cost_mask) {
		this.literal_costs_ = FunctionMalloc.mallocFloat(num_bytes + 1);
		this.literal_costs_[0] = 0.0;
		if(literal_cost != null) {
			var _g1 = 0;
			var _g = num_bytes;
			while(_g1 < _g) {
				var i = _g1++;
				this.literal_costs_[i + 1] = this.literal_costs_[i] + literal_cost[position + i & literal_cost_mask];
			}
		} else {
			var _g11 = 1;
			var _g2 = num_bytes + 1;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.literal_costs_[i1] = i1 * 5.4;
			}
		}
		this.cost_cmd_ = new Array(704);
		this.cost_dist_ = new Array(520);
		var _g3 = 0;
		while(_g3 < 704) {
			var i2 = _g3++;
			this.cost_cmd_[i2] = encode_Fast_$log.FastLog2(11 + i2);
		}
		var _g4 = 0;
		while(_g4 < 520) {
			var i3 = _g4++;
			this.cost_dist_[i3] = encode_Fast_$log.FastLog2(20 + i3);
		}
		this.min_cost_cmd_ = encode_Fast_$log.FastLog2(11);
	}
	,GetCommandCost: function(dist_code,length_code,insert_length) {
		var inscode = encode_Command_$functions.GetInsertLengthCode(insert_length);
		var copycode = encode_Command_$functions.GetCopyLengthCode(length_code);
		var cmdcode = encode_Command_$functions.CombineLengthCodes(inscode,copycode,dist_code);
		var insnumextra = encode_Command_$functions.insextra[inscode];
		var copynumextra = encode_Command_$functions.copyextra[copycode];
		var dist_symbol = [];
		var distextra = [];
		encode_Command_$functions.GetDistCode(dist_code,dist_symbol,distextra);
		var result = _$UInt_UInt_$Impl_$.toFloat(insnumextra + copynumextra + (distextra[0] >>> 24));
		result += this.cost_cmd_[cmdcode];
		if(_$UInt_UInt_$Impl_$.gte(cmdcode,128)) {
			result += this.cost_dist_[dist_symbol[0]];
		}
		return result;
	}
	,GetLiteralCosts: function(from,to) {
		return this.literal_costs_[to] - this.literal_costs_[from];
	}
	,GetMinCostCmd: function() {
		return this.min_cost_cmd_;
	}
	,Set: function(histogram,cost) {
		var length = histogram.length;
		cost[0] = new Array(length);
		var sum = 0;
		var _g1 = 0;
		var _g = histogram.length;
		while(_g1 < _g) sum += histogram[_g1++];
		var log2sum = encode_Fast_$log.FastLog2(sum);
		var _g11 = 0;
		var _g2 = histogram.length;
		while(_g11 < _g2) {
			var i = _g11++;
			if(histogram[i] == 0) {
				cost[0][i] = log2sum + 2;
				continue;
			}
			cost[0][i] = log2sum - encode_Fast_$log.FastLog2(histogram[i]);
			if(cost[0][i] < 1) {
				cost[0][i] = 1;
			}
		}
	}
	,__class__: encode_backward_$references_ZopfliCostModel
};
var encode_backward_$references_ZopfliNode = function() {
	this.distance_cache = FunctionMalloc.mallocInt(4);
	this.length = 1;
	this.distance = 0;
	this.distance_code = 0;
	this.length_code = 0;
	this.insert_length = 0;
	this.cost = encode_Backward_$references.kInfinity;
};
encode_backward_$references_ZopfliNode.__name__ = true;
encode_backward_$references_ZopfliNode.prototype = {
	__class__: encode_backward_$references_ZopfliNode
};
var encode_block_$splitter_BlockSplitIterator = function(split) {
	this.split_ = split;
	this.idx_ = 0;
	this.type_ = 0;
	this.length_ = 0;
	if(split.lengths.length != 0) {
		this.length_ = split.lengths[0];
	}
};
encode_block_$splitter_BlockSplitIterator.__name__ = true;
encode_block_$splitter_BlockSplitIterator.prototype = {
	Next: function() {
		if(this.length_ == 0) {
			++this.idx_;
			this.type_ = this.split_.types[this.idx_];
			this.length_ = this.split_.lengths[this.idx_];
		}
		--this.length_;
	}
	,__class__: encode_block_$splitter_BlockSplitIterator
};
var encode_brotli_$bit_$stream_BlockEncoder = function(alphabet_size,num_block_types,block_types,block_lengths) {
	this.block_split_code_ = new encode_brotli_$bit_$stream_BlockSplitCode();
	this.alphabet_size_ = alphabet_size;
	this.num_block_types_ = num_block_types;
	this.block_types_ = block_types;
	this.block_lengths_ = block_lengths;
	this.block_ix_ = 0;
	this.block_len_ = block_lengths.length == 0 ? 0 : block_lengths[0];
	this.entropy_ix_ = 0;
};
encode_brotli_$bit_$stream_BlockEncoder.__name__ = true;
encode_brotli_$bit_$stream_BlockEncoder.prototype = {
	BuildAndStoreBlockSwitchEntropyCodes: function(storage_ix,storage) {
		encode_Brotli_$bit_$stream.BuildAndStoreBlockSplitCode(this.block_types_,this.block_lengths_,this.num_block_types_,this.block_split_code_,storage_ix,storage);
	}
	,BuildAndStoreEntropyCodes: function(histograms,storage_ix,storage) {
		this.depths_ = FunctionMalloc.mallocUInt(histograms.length * this.alphabet_size_);
		this.bits_ = FunctionMalloc.mallocUInt(histograms.length * this.alphabet_size_);
		var _g1 = 0;
		var _g = histograms.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ix = i * this.alphabet_size_;
			encode_Brotli_$bit_$stream.BuildAndStoreHuffmanTree(histograms[i].data_,this.alphabet_size_,this.depths_,ix,this.bits_,ix,storage_ix,storage);
		}
	}
	,StoreSymbol: function(symbol,storage_ix,storage) {
		if(this.block_len_ == 0) {
			++this.block_ix_;
			this.block_len_ = this.block_lengths_[this.block_ix_];
			this.entropy_ix_ = this.block_types_[this.block_ix_] * this.alphabet_size_;
			encode_Brotli_$bit_$stream.StoreBlockSwitch(this.block_split_code_,this.block_ix_,storage_ix,storage);
		}
		--this.block_len_;
		var ix = this.entropy_ix_ + symbol;
		encode_Write_$bits.WriteBits(this.depths_[ix],this.bits_[ix],storage_ix,storage);
	}
	,StoreSymbolWithContext: function(kContextBits,symbol,context,context_map,storage_ix,storage) {
		if(this.block_len_ == 0) {
			++this.block_ix_;
			this.block_len_ = this.block_lengths_[this.block_ix_];
			this.entropy_ix_ = this.block_types_[this.block_ix_] << kContextBits;
			encode_Brotli_$bit_$stream.StoreBlockSwitch(this.block_split_code_,this.block_ix_,storage_ix,storage);
		}
		--this.block_len_;
		var ix = context_map[this.entropy_ix_ + context] * this.alphabet_size_ + symbol;
		encode_Write_$bits.WriteBits(this.depths_[ix],this.bits_[ix],storage_ix,storage);
	}
	,__class__: encode_brotli_$bit_$stream_BlockEncoder
};
var encode_brotli_$bit_$stream_BlockSplitCode = function() {
};
encode_brotli_$bit_$stream_BlockSplitCode.__name__ = true;
encode_brotli_$bit_$stream_BlockSplitCode.prototype = {
	__class__: encode_brotli_$bit_$stream_BlockSplitCode
};
var encode_cluster_HistogramPair = function() {
};
encode_cluster_HistogramPair.__name__ = true;
encode_cluster_HistogramPair.prototype = {
	__class__: encode_cluster_HistogramPair
};
var encode_command_Command = function() {
	this.dist_extra_ = [];
	this.cmd_extra_ = [];
	this.dist_prefix_ = [];
	this.cmd_prefix_ = [];
};
encode_command_Command.__name__ = true;
encode_command_Command.prototype = {
	Command0: function() {
	}
	,Command4: function(insertlen,copylen,copylen_code,distance_code) {
		this.insert_len_ = insertlen;
		this.copy_len_ = copylen;
		encode_Command_$functions.GetDistCode(distance_code,this.dist_prefix_,this.dist_extra_);
		encode_Command_$functions.GetLengthCode(insertlen,copylen_code,this.dist_prefix_[0],this.cmd_prefix_,this.cmd_extra_);
	}
	,Command1: function(insertlen) {
		this.insert_len_ = insertlen;
		this.copy_len_ = 0;
		this.dist_prefix_[0] = 16;
		this.dist_extra_[0] = 0;
		encode_Command_$functions.GetLengthCode(insertlen,4,this.dist_prefix_[0],this.cmd_prefix_,this.cmd_extra_);
	}
	,DistanceCode: function() {
		if(_$UInt_UInt_$Impl_$.gt(16,this.dist_prefix_[0])) {
			return this.dist_prefix_[0];
		}
		var nbits = this.dist_extra_[0] >>> 24;
		return (this.dist_prefix_[0] - 12 - 2 * nbits << nbits) + (this.dist_extra_[0] & 16777215) + 12;
	}
	,DistanceContext: function() {
		var c = this.cmd_prefix_[0] & 7;
		var r = this.cmd_prefix_[0] >>> 6;
		if((r == 0 || r == 2 || r == 4 || r == 7) && c <= 2) {
			return c;
		}
		return 3;
	}
	,__class__: encode_command_Command
};
var encode_encode_BrotliCompressor = function(params) {
	this.saved_dist_cache_ = new Array(4);
	this.dist_cache_ = new Array(4);
	this.params_ = params;
	this.hashers_ = new encode_hash_Hashers();
	this.input_pos_ = 0;
	this.num_commands_ = 0;
	this.num_literals_ = 0;
	this.last_insert_len_ = 0;
	this.last_flush_pos_ = 0;
	this.last_processed_pos_ = 0;
	this.prev_byte_ = 0;
	this.prev_byte2_ = 0;
	this.storage_size_ = 0;
	this.params_.quality = Math.max(1,this.params_.quality) | 0;
	if(this.params_.lgwin < encode_Encode.kMinWindowBits) {
		this.params_.lgwin = encode_Encode.kMinWindowBits;
	} else if(this.params_.lgwin > encode_Encode.kMaxWindowBits) {
		this.params_.lgwin = encode_Encode.kMaxWindowBits;
	}
	if(this.params_.lgblock == 0) {
		this.params_.lgblock = this.params_.quality < encode_Encode.kMinQualityForBlockSplit ? 14 : 16;
		if(this.params_.quality >= 9 && this.params_.lgwin > this.params_.lgblock) {
			this.params_.lgblock = Math.min(21,this.params_.lgwin) | 0;
		}
	} else {
		var tmp = encode_Encode.kMaxInputBlockBits;
		var tmp1 = Math.max(encode_Encode.kMinInputBlockBits,this.params_.lgblock);
		this.params_.lgblock = Math.min(tmp,tmp1) | 0;
	}
	this.max_backward_distance_ = (1 << this.params_.lgwin) - 16;
	this.ringbuffer_ = new encode_RingBuffer(Math.max(this.params_.lgwin + 1,this.params_.lgblock + 1) | 0,this.params_.lgblock);
	if(this.params_.quality > 9) {
		this.literal_cost_mask_ = (1 << this.params_.lgblock) - 1;
		this.literal_cost_ = FunctionMalloc.mallocFloat(this.literal_cost_mask_ + 1);
	}
	this.cmd_buffer_size_ = Math.max(262144,1 << this.params_.lgblock) | 0;
	this.commands_ = [];
	if(this.params_.lgwin == 16) {
		this.last_byte_ = 0;
		this.last_byte_bits_ = 1;
	} else if(this.params_.lgwin == 17) {
		this.last_byte_ = 1;
		this.last_byte_bits_ = 7;
	} else {
		this.last_byte_ = this.params_.lgwin - 17 << 1 | 1;
		this.last_byte_bits_ = 4;
	}
	this.dist_cache_[0] = 4;
	this.dist_cache_[1] = 11;
	this.dist_cache_[2] = 15;
	this.dist_cache_[3] = 16;
	DefaultFunctions.memcpy_Int(this.saved_dist_cache_,0,this.dist_cache_,0,this.dist_cache_.length);
	this.hash_type_ = Math.min(9,this.params_.quality) | 0;
	this.hashers_.Init(this.hash_type_);
};
encode_encode_BrotliCompressor.__name__ = true;
encode_encode_BrotliCompressor.prototype = {
	GetBrotliStorage: function(size) {
		if(this.storage_size_ < size) {
			this.storage_ = FunctionMalloc.mallocUInt(size);
			this.storage_size_ = size;
		}
		return this.storage_;
	}
	,input_block_size: function() {
		return 1 << this.params_.lgblock;
	}
	,CopyInputToRingBuffer: function(input_size,input_buffer) {
		this.ringbuffer_.Write(input_buffer,input_size);
		this.input_pos_ += input_size;
		var pos = this.ringbuffer_.position();
		if(pos <= this.ringbuffer_.mask()) {
			DefaultFunctions.memset_UInt(this.ringbuffer_.start(),pos,0,3);
		}
	}
	,BrotliSetCustomDictionary: function(size,dict) {
		this.CopyInputToRingBuffer(size,dict);
		this.last_flush_pos_ = size;
		this.last_processed_pos_ = size;
		if(size > 0) {
			this.prev_byte_ = dict[size - 1];
		}
		if(size > 1) {
			this.prev_byte2_ = dict[size - 2];
		}
		this.hashers_.PrependCustomDictionary(this.hash_type_,size,dict);
	}
	,WriteBrotliData: function(is_last,force_flush,out_size,output) {
		var bytes = this.input_pos_ - this.last_processed_pos_;
		var data = this.ringbuffer_.start();
		var mask = this.ringbuffer_.mask();
		if(bytes > this.input_block_size()) {
			return false;
		}
		var utf8_mode = this.params_.quality >= 9 && encode_Encode.IsMostlyUTF8(data,this.last_processed_pos_ & mask,bytes,encode_Encode.kMinUTF8Ratio);
		if(this.literal_cost_ != null) {
			if(utf8_mode) {
				encode_Literal_$cost.EstimateBitCostsForLiteralsUTF8(this.last_processed_pos_,bytes,mask,this.literal_cost_mask_,data,this.literal_cost_);
			} else {
				encode_Literal_$cost.EstimateBitCostsForLiterals(this.last_processed_pos_,bytes,mask,this.literal_cost_mask_,data,this.literal_cost_);
			}
		}
		var last_insert_len = [this.last_insert_len_];
		var num_commands = [this.num_commands_];
		var num_literals = [this.num_literals_];
		encode_Backward_$references.CreateBackwardReferences(bytes,this.last_processed_pos_,data,mask,this.literal_cost_,this.literal_cost_mask_,this.max_backward_distance_,this.params_.quality,this.hashers_,this.hash_type_,this.dist_cache_,last_insert_len,this.commands_,num_commands[0],num_commands,num_literals);
		this.last_insert_len_ = last_insert_len[0];
		this.num_commands_ = num_commands[0];
		this.num_literals_ = num_literals[0];
		if(!is_last && !force_flush && (this.params_.quality >= encode_Encode.kMinQualityForBlockSplit || this.num_literals_ + this.num_commands_ < 12287) && this.num_commands_ + (this.input_block_size() >> 1) < this.cmd_buffer_size_ && this.input_pos_ + this.input_block_size() <= this.last_flush_pos_ + (Math.min(mask + 1,1 << encode_Encode.kMaxInputBlockBits) | 0)) {
			this.last_processed_pos_ = this.input_pos_;
			out_size[0] = 0;
			return true;
		}
		if(this.last_insert_len_ > 0) {
			var command = new encode_command_Command();
			command.Command1(this.last_insert_len_);
			this.commands_[this.num_commands_++] = command;
			this.num_literals_ += this.last_insert_len_;
			this.last_insert_len_ = 0;
		}
		return this.WriteMetaBlockInternal(is_last,utf8_mode,out_size,output);
	}
	,WriteMetaBlockInternal: function(is_last,utf8_mode,out_size,output) {
		var bytes = this.input_pos_ - this.last_flush_pos_;
		var data = this.ringbuffer_.start();
		var mask = this.ringbuffer_.mask();
		var storage = this.GetBrotliStorage(2 * bytes + 500);
		storage[0] = this.last_byte_;
		var storage_ix = [this.last_byte_bits_];
		var uncompressed = false;
		if(this.num_commands_ < (bytes >> 8) + 2) {
			if(this.num_literals_ > 0.99 * bytes) {
				var literal_histo = FunctionMalloc.mallocInt(256);
				var kBitCostThreshold = bytes * 7.92 / 13;
				var i = this.last_flush_pos_;
				while(i < this.input_pos_) {
					var _g = data[i & mask];
					literal_histo[_g] = literal_histo[_g] + 1;
					i += 13;
				}
				if(encode_Bit_$cost.BitsEntropy(literal_histo,0,256) > kBitCostThreshold) {
					uncompressed = true;
				}
			}
		}
		if(bytes == 0) {
			if(!encode_Brotli_$bit_$stream.StoreCompressedMetaBlockHeader(is_last,0,storage_ix,storage)) {
				return false;
			}
			storage_ix[0] = storage_ix[0] + 7 & -8;
		} else if(uncompressed) {
			DefaultFunctions.memcpy_Int(this.dist_cache_,0,this.saved_dist_cache_,0,this.dist_cache_.length);
			if(!encode_Brotli_$bit_$stream.StoreUncompressedMetaBlock(is_last,data,this.last_flush_pos_,mask,bytes,storage_ix,storage,0)) {
				return false;
			}
		} else {
			var num_direct_distance_codes = 0;
			var distance_postfix_bits = 0;
			if(this.params_.quality > 9 && this.params_.mode == 2) {
				num_direct_distance_codes = 12;
				distance_postfix_bits = 1;
				encode_Encode.RecomputeDistancePrefixes(this.commands_,this.num_commands_,12,1);
			}
			if(this.params_.quality < encode_Encode.kMinQualityForBlockSplit) {
				if(!encode_Brotli_$bit_$stream.StoreMetaBlockTrivial(data,this.last_flush_pos_,bytes,mask,is_last,this.commands_,this.num_commands_,storage_ix,storage,0)) {
					return false;
				}
			} else {
				var mb = new encode_metablock_MetaBlockSplit();
				var literal_context_mode = [utf8_mode ? 2 : 3];
				if(this.params_.quality <= 9) {
					var num_literal_contexts = [1];
					var literal_context_map = [[-1]];
					encode_Encode.DecideOverLiteralContextModeling(data,this.last_flush_pos_,bytes,mask,this.params_.quality,literal_context_mode,num_literal_contexts,literal_context_map);
					if(literal_context_map[0][0] == -1) {
						encode_Metablock.BuildMetaBlockGreedy(data,this.last_flush_pos_,mask,this.commands_,this.num_commands_,mb);
					} else {
						encode_Metablock.BuildMetaBlockGreedyWithContexts(data,this.last_flush_pos_,mask,this.prev_byte_,this.prev_byte2_,literal_context_mode[0],num_literal_contexts[0],literal_context_map[0],this.commands_,this.num_commands_,mb);
					}
				} else {
					encode_Metablock.BuildMetaBlock(data,this.last_flush_pos_,mask,this.prev_byte_,this.prev_byte2_,this.commands_,this.num_commands_,literal_context_mode[0],mb);
				}
				if(this.params_.quality >= encode_Encode.kMinQualityForOptimizeHistograms) {
					encode_Metablock.OptimizeHistograms(num_direct_distance_codes,distance_postfix_bits,mb);
				}
				if(!encode_Brotli_$bit_$stream.StoreMetaBlock(data,this.last_flush_pos_,bytes,mask,this.prev_byte_,this.prev_byte2_,is_last,num_direct_distance_codes,distance_postfix_bits,literal_context_mode[0],this.commands_,this.num_commands_,mb,storage_ix,storage)) {
					return false;
				}
			}
			if(bytes + 4 < storage_ix[0] >> 3) {
				DefaultFunctions.memcpy_Int(this.dist_cache_,0,this.saved_dist_cache_,0,this.dist_cache_.length);
				storage[0] = this.last_byte_;
				storage_ix[0] = this.last_byte_bits_;
				if(!encode_Brotli_$bit_$stream.StoreUncompressedMetaBlock(is_last,data,this.last_flush_pos_,mask,bytes,storage_ix,storage,0)) {
					return false;
				}
			}
		}
		this.last_byte_ = storage[storage_ix[0] >> 3];
		this.last_byte_bits_ = storage_ix[0] & 7;
		this.last_flush_pos_ = this.input_pos_;
		this.last_processed_pos_ = this.input_pos_;
		this.prev_byte_ = data[this.last_flush_pos_ - 1 & mask];
		this.prev_byte2_ = data[this.last_flush_pos_ - 2 & mask];
		this.num_commands_ = 0;
		this.num_literals_ = 0;
		DefaultFunctions.memcpy_Int(this.saved_dist_cache_,0,this.dist_cache_,0,this.dist_cache_.length);
		output[0] = storage;
		out_size[0] = storage_ix[0] >> 3;
		return true;
	}
	,__class__: encode_encode_BrotliCompressor
};
var encode_encode_BrotliParams = function() {
	this.mode = 0;
	this.quality = 11;
	this.lgwin = 22;
	this.lgblock = 0;
	this.enable_dictionary = true;
	this.enable_transforms = false;
	this.greedy_block_split = false;
	this.enable_context_modeling = true;
};
encode_encode_BrotliParams.__name__ = true;
encode_encode_BrotliParams.prototype = {
	__class__: encode_encode_BrotliParams
};
var encode_entropy_$encode_EntropyCode = function(kSize) {
	this.symbols_ = FunctionMalloc.mallocUInt(4);
	this.depth_ = FunctionMalloc.mallocUInt(kSize);
	this.bits_ = FunctionMalloc.mallocUInt(kSize);
};
encode_entropy_$encode_EntropyCode.__name__ = true;
encode_entropy_$encode_EntropyCode.prototype = {
	__class__: encode_entropy_$encode_EntropyCode
};
var encode_entropy_$encode_HuffmanTree = function() {
};
encode_entropy_$encode_HuffmanTree.__name__ = true;
encode_entropy_$encode_HuffmanTree.prototype = {
	HuffmanTree3: function(count,left,right) {
		this.total_count_ = count;
		this.index_left_ = left;
		this.index_right_or_value_ = right;
	}
	,__class__: encode_entropy_$encode_HuffmanTree
};
var encode_hash_BackwardMatch = function() {
};
encode_hash_BackwardMatch.__name__ = true;
encode_hash_BackwardMatch.prototype = {
	BackwardMatch0: function() {
		this.distance = 0;
		this.length_and_code = 0;
	}
	,BackwardMatch2: function(dist,len) {
		this.distance = dist;
		this.length_and_code = len << 5;
	}
	,BackwardMatch3: function(dist,len,len_code) {
		this.distance = dist;
		this.length_and_code = len << 5 | (len == len_code ? 0 : len_code);
	}
	,length: function() {
		return this.length_and_code >> 5;
	}
	,length_code: function() {
		var code = this.length_and_code & 31;
		if(code > 0) {
			return code;
		} else {
			return this.length();
		}
	}
	,__class__: encode_hash_BackwardMatch
};
var encode_hash_HashLongestMatch = function(kBucketBits,kBlockBits,kNumLastDistancesToCheck) {
	this.kBucketBits = kBucketBits;
	this.kBlockBits = kBlockBits;
	this.kNumLastDistancesToCheck = kNumLastDistancesToCheck;
	this.kBucketSize = 1 << kBucketBits;
	this.kBlockSize = 1 << kBlockBits;
	this.kBlockMask = (1 << kBlockBits) - 1;
	var length = this.kBucketSize;
	this.num_ = new Array(length);
	var length1 = this.kBucketSize;
	this.buckets_ = new Array(length1);
	var _g1 = 0;
	var _g = this.kBucketSize;
	while(_g1 < _g) {
		var length2 = this.kBlockSize;
		this.buckets_[_g1++] = new Array(length2);
	}
	this.Reset();
};
encode_hash_HashLongestMatch.__name__ = true;
encode_hash_HashLongestMatch.prototype = {
	Reset: function() {
		DefaultFunctions.memset_UInt(this.num_,0,0,this.num_.length);
		this.num_dict_lookups_ = 0;
		this.num_dict_matches_ = 0;
	}
	,Store: function(data,data_off,ix) {
		var key = encode_Hash.Hash_(this.kBucketBits,data,data_off);
		var minor_ix = this.num_[key] & this.kBlockMask;
		if(this.buckets_[key] == null) {
			var length = this.kBlockSize;
			this.buckets_[key] = new Array(length);
		}
		this.buckets_[key][minor_ix] = ix;
		var _g = key;
		this.num_[_g] = this.num_[_g] + 1;
	}
	,FindLongestMatch: function(data,ring_buffer_mask,distance_cache,cur_ix,max_length,max_backward,best_len_out,best_len_code_out,best_distance_out,best_score_out) {
		best_len_code_out[0] = 0;
		var cur_ix_masked = cur_ix & ring_buffer_mask;
		var match_found = false;
		var best_score = best_score_out[0];
		var best_len = best_len_out[0];
		best_len_out[0] = 0;
		var _g1 = 0;
		var _g = this.kNumLastDistancesToCheck;
		while(_g1 < _g) {
			var i = _g1++;
			var backward = distance_cache[encode_Hash.kDistanceCacheIndex[i]] + encode_Hash.kDistanceCacheOffset[i];
			var prev_ix = cur_ix - backward;
			if(_$UInt_UInt_$Impl_$.gte(prev_ix,cur_ix)) {
				continue;
			}
			if(_$UInt_UInt_$Impl_$.gt(backward,max_backward)) {
				continue;
			}
			prev_ix = prev_ix & ring_buffer_mask;
			if(cur_ix_masked + best_len > ring_buffer_mask || _$UInt_UInt_$Impl_$.gt(prev_ix + best_len,ring_buffer_mask) || data[cur_ix_masked + best_len] != data[prev_ix + best_len]) {
				continue;
			}
			var len = encode_Find_$match_$length.FindMatchLengthWithLimit(data,prev_ix,data,cur_ix_masked,max_length);
			if(len >= 3 || len == 2 && i < 2) {
				var score = encode_Hash.BackwardReferenceScoreUsingLastDistance(len,i);
				if(best_score < score) {
					best_score = score;
					best_len = len;
					best_len_out[0] = len;
					best_len_code_out[0] = len;
					best_distance_out[0] = backward;
					best_score_out[0] = score;
					match_found = true;
				}
			}
		}
		var key = encode_Hash.Hash_(this.kBucketBits,data,cur_ix_masked);
		var bucket = this.buckets_[key];
		var down = _$UInt_UInt_$Impl_$.gt(this.num_[key],this.kBlockSize) ? this.num_[key] - this.kBlockSize : 0;
		var i1 = this.num_[key] - 1;
		while(i1 >= down) {
			var prev_ix1 = bucket[i1 & this.kBlockMask];
			if(prev_ix1 != -1 && prev_ix1 >= 0) {
				var backward1 = cur_ix - prev_ix1;
				if(_$UInt_UInt_$Impl_$.gt(backward1,max_backward)) {
					break;
				}
				prev_ix1 &= ring_buffer_mask;
				if(cur_ix_masked + best_len > ring_buffer_mask || prev_ix1 + best_len > ring_buffer_mask || data[cur_ix_masked + best_len] != data[prev_ix1 + best_len]) {
					--i1;
					continue;
				}
				var len1 = encode_Find_$match_$length.FindMatchLengthWithLimit(data,prev_ix1,data,cur_ix_masked,max_length);
				if(len1 >= 4) {
					var score1 = encode_Hash.BackwardReferenceScore(len1,backward1);
					if(best_score < score1) {
						best_score = score1;
						best_len = len1;
						best_len_out[0] = len1;
						best_len_code_out[0] = len1;
						best_distance_out[0] = backward1;
						best_score_out[0] = score1;
						match_found = true;
					}
				}
			}
			--i1;
		}
		if(!match_found && this.num_dict_matches_ >= this.num_dict_lookups_ >> 7) {
			var key1 = encode_Hash.Hash_(14,data,cur_ix_masked) << 1;
			var _g2 = 0;
			while(_g2 < 2) {
				++_g2;
				++this.num_dict_lookups_;
				var v = encode_Dictionary_$hash.kStaticDictionaryHash[key1];
				if(_$UInt_UInt_$Impl_$.gt(v,0)) {
					var len2 = v & 31;
					var dist = v >>> 5;
					if(_$UInt_UInt_$Impl_$.gte(max_length,len2)) {
						if(encode_Find_$match_$length.FindMatchLengthWithLimit(data,cur_ix_masked,encode_Dictionary.kBrotliDictionary,encode_Dictionary.kBrotliDictionaryOffsetsByLength[len2] + len2 * dist,len2) == len2) {
							var backward2 = max_backward + dist + 1;
							var score2 = encode_Hash.BackwardReferenceScore(len2,backward2);
							if(best_score < score2) {
								++this.num_dict_matches_;
								best_len_out[0] = len2;
								best_len_code_out[0] = len2;
								best_distance_out[0] = backward2;
								best_score_out[0] = score2;
								match_found = true;
								break;
							}
						}
					}
				}
				++key1;
			}
		}
		return match_found;
	}
	,FindAllMatches: function(data,ring_buffer_mask,cur_ix,max_length,max_backward,num_matches,num_matches_off,matches,matches_off) {
		var orig_matches = matches;
		var orig_matches_off = matches_off;
		var cur_ix_masked = cur_ix & ring_buffer_mask;
		var best_len = 1;
		var stop = cur_ix - 64;
		if(stop < 0) {
			stop = 0;
		}
		var i = cur_ix - 1;
		while(i > stop && best_len <= 2) {
			var prev_ix = i;
			var backward = cur_ix - prev_ix;
			if(_$UInt_UInt_$Impl_$.gt(backward,max_backward)) {
				break;
			}
			prev_ix &= ring_buffer_mask;
			if(data[cur_ix_masked] != data[prev_ix] || data[cur_ix_masked + 1] != data[prev_ix + 1]) {
				--i;
				continue;
			}
			var len = encode_Find_$match_$length.FindMatchLengthWithLimit(data,prev_ix,data,cur_ix_masked,max_length);
			if(len > best_len) {
				best_len = len;
				if(len > 325) {
					matches = orig_matches;
				}
				var match = new encode_hash_BackwardMatch();
				match.BackwardMatch2(backward,len);
				matches[matches_off++] = match;
			}
			--i;
		}
		var key = encode_Hash.Hash_(this.kBucketBits,data,cur_ix_masked);
		var bucket = this.buckets_[key];
		var down = _$UInt_UInt_$Impl_$.gt(this.num_[key],this.kBlockSize) ? this.num_[key] - this.kBlockSize : 0;
		var i1 = this.num_[key] - 1;
		while(i1 >= down) {
			var prev_ix1 = bucket[i1 & this.kBlockMask];
			if(prev_ix1 >= 0) {
				var backward1 = cur_ix - prev_ix1;
				if(_$UInt_UInt_$Impl_$.gt(backward1,max_backward)) {
					break;
				}
				prev_ix1 &= ring_buffer_mask;
				if(cur_ix_masked + best_len > ring_buffer_mask || prev_ix1 + best_len > ring_buffer_mask || data[cur_ix_masked + best_len] != data[prev_ix1 + best_len]) {
					--i1;
					continue;
				}
				var len1 = encode_Find_$match_$length.FindMatchLengthWithLimit(data,prev_ix1,data,cur_ix_masked,max_length);
				if(len1 > best_len) {
					best_len = len1;
					if(len1 > 325) {
						matches_off = orig_matches_off;
					}
					var match1 = new encode_hash_BackwardMatch();
					match1.BackwardMatch2(backward1,len1);
					matches[matches_off++] = match1;
				}
			}
			--i1;
		}
		var dict_matches = FunctionMalloc.mallocInt(38);
		DefaultFunctions.memset_Int(dict_matches,0,268435455,dict_matches.length);
		var minlen = Math.max(4,best_len + 1) | 0;
		if(encode_Static_$dict.FindAllStaticDictionaryMatches(data,cur_ix_masked,minlen,dict_matches,0)) {
			var maxlen = Math.min(37,_$UInt_UInt_$Impl_$.toFloat(max_length)) | 0;
			var _g1 = minlen;
			while(_g1 < maxlen) {
				var l = _g1++;
				var dict_id = dict_matches[l];
				if(dict_id < 268435455) {
					var match2 = new encode_hash_BackwardMatch();
					match2.BackwardMatch3(max_backward + (dict_id >> 5) + 1,l,dict_id & 31);
					matches[matches_off++] = match2;
				}
			}
		}
		num_matches[num_matches_off] = num_matches[num_matches_off] + (matches_off - orig_matches_off);
	}
	,__class__: encode_hash_HashLongestMatch
};
var encode_hash_HashLongestMatchQuickly = function(kBucketBits,kBucketSweep,kUseDictionary) {
	this.kBucketBits = kBucketBits;
	this.kBucketSweep = kBucketSweep;
	this.kUseDictionary = kUseDictionary;
	this.kBucketSize = 1 << kBucketBits;
	var length = this.kBucketSize + kBucketSweep;
	this.buckets_ = new Array(length);
	this.Reset();
};
encode_hash_HashLongestMatchQuickly.__name__ = true;
encode_hash_HashLongestMatchQuickly.prototype = {
	Reset: function() {
		DefaultFunctions.memset_UInt(this.buckets_,0,0,this.buckets_.length);
		this.num_dict_lookups_ = 0;
		this.num_dict_matches_ = 0;
	}
	,Store: function(data,data_off,ix) {
		this.buckets_[encode_Hash.Hash_(this.kBucketBits,data,data_off) + (ix >> 3) % this.kBucketSweep] = ix;
	}
	,FindLongestMatch: function(ring_buffer,ring_buffer_mask,distance_cache,cur_ix,max_length,max_backward,best_len_out,best_len_code_out,best_distance_out,best_score_out) {
		var best_len_in = best_len_out[0];
		var cur_ix_masked = cur_ix & ring_buffer_mask;
		var compare_char = ring_buffer[cur_ix_masked + best_len_in];
		var best_score = best_score_out[0];
		var best_len = best_len_in;
		var backward = distance_cache[0];
		var prev_ix = cur_ix - backward;
		var match_found = false;
		if(_$UInt_UInt_$Impl_$.gt(cur_ix,prev_ix)) {
			prev_ix = prev_ix & ring_buffer_mask;
			if(compare_char == ring_buffer[prev_ix + best_len_in]) {
				var len = encode_Find_$match_$length.FindMatchLengthWithLimit(ring_buffer,prev_ix,ring_buffer,cur_ix_masked,max_length);
				if(len >= 4) {
					best_score = encode_Hash.BackwardReferenceScoreUsingLastDistance(len,0);
					best_len = len;
					best_len_out[0] = len;
					best_len_code_out[0] = len;
					best_distance_out[0] = backward;
					best_score_out[0] = best_score;
					compare_char = ring_buffer[cur_ix_masked + len];
					if(this.kBucketSweep == 1) {
						return true;
					} else {
						match_found = true;
					}
				}
			}
		}
		var key = encode_Hash.Hash_(this.kBucketBits,ring_buffer,cur_ix_masked);
		if(this.kBucketSweep == 1) {
			prev_ix = this.buckets_[key];
			backward = cur_ix - prev_ix;
			prev_ix = prev_ix & ring_buffer_mask;
			if(compare_char != ring_buffer[prev_ix + best_len_in]) {
				return false;
			}
			if(backward == 0 || backward > max_backward) {
				return false;
			}
			var len1 = encode_Find_$match_$length.FindMatchLengthWithLimit(ring_buffer,prev_ix,ring_buffer,cur_ix_masked,max_length);
			if(len1 >= 4) {
				best_len_out[0] = len1;
				best_len_code_out[0] = len1;
				best_distance_out[0] = backward;
				best_score_out[0] = encode_Hash.BackwardReferenceScore(len1,backward);
				return true;
			}
		} else {
			var bucket = this.buckets_;
			var bucket_off = 0 + key;
			var _g1 = 0;
			var _g = this.kBucketSweep;
			while(_g1 < _g) {
				++_g1;
				prev_ix = bucket[bucket_off++];
				var backward1 = cur_ix - prev_ix;
				prev_ix = prev_ix & ring_buffer_mask;
				if(compare_char != ring_buffer[prev_ix + best_len]) {
					continue;
				}
				if(backward1 == 0 || backward1 > max_backward) {
					continue;
				}
				var len2 = encode_Find_$match_$length.FindMatchLengthWithLimit(ring_buffer,prev_ix,ring_buffer,cur_ix_masked,max_length);
				if(len2 >= 4) {
					var score = encode_Hash.BackwardReferenceScore(len2,backward1);
					if(best_score < score) {
						best_score = score;
						best_len = len2;
						best_len_out[0] = len2;
						best_len_code_out[0] = len2;
						best_distance_out[0] = backward1;
						best_score_out[0] = score;
						compare_char = ring_buffer[cur_ix_masked + len2];
						match_found = true;
					}
				}
			}
		}
		if(this.kUseDictionary && !match_found && this.num_dict_matches_ >= this.num_dict_lookups_ >> 7) {
			++this.num_dict_lookups_;
			var v = encode_Dictionary_$hash.kStaticDictionaryHash[encode_Hash.Hash_(14,ring_buffer,cur_ix_masked) << 1];
			if(_$UInt_UInt_$Impl_$.gt(v,0)) {
				var len3 = v & 31;
				var dist = v >>> 5;
				if(len3 <= max_length) {
					if(encode_Find_$match_$length.FindMatchLengthWithLimit(ring_buffer,cur_ix_masked,encode_Dictionary.kBrotliDictionary,encode_Dictionary.kBrotliDictionaryOffsetsByLength[len3] + len3 * dist,len3) == len3) {
						var backward2 = max_backward + dist + 1;
						var score1 = encode_Hash.BackwardReferenceScore(len3,backward2);
						if(best_score < score1) {
							++this.num_dict_matches_;
							best_len_out[0] = len3;
							best_len_code_out[0] = len3;
							best_distance_out[0] = backward2;
							best_score_out[0] = score1;
							return true;
						}
					}
				}
			}
		}
		return match_found;
	}
	,__class__: encode_hash_HashLongestMatchQuickly
};
var encode_hash_Hashers = function() {
};
encode_hash_Hashers.__name__ = true;
encode_hash_Hashers.prototype = {
	Init: function(type) {
		switch(type) {
		case 1:
			this.hash_h1 = new encode_hash_HashLongestMatchQuickly(16,1,true);
			break;
		case 2:
			this.hash_h2 = new encode_hash_HashLongestMatchQuickly(16,2,false);
			break;
		case 3:
			this.hash_h3 = new encode_hash_HashLongestMatchQuickly(16,4,false);
			break;
		case 4:
			this.hash_h4 = new encode_hash_HashLongestMatchQuickly(17,4,true);
			break;
		case 5:
			this.hash_h5 = new encode_hash_HashLongestMatch(14,4,4);
			break;
		case 6:
			this.hash_h6 = new encode_hash_HashLongestMatch(14,5,4);
			break;
		case 7:
			this.hash_h7 = new encode_hash_HashLongestMatch(15,6,10);
			break;
		case 8:
			this.hash_h8 = new encode_hash_HashLongestMatch(15,7,10);
			break;
		case 9:
			this.hash_h9 = new encode_hash_HashLongestMatch(15,8,16);
			break;
		default:
		}
	}
	,WarmupHashHashLongestMatchQuickly: function(size,dict,hasher) {
		var _g1 = 0;
		while(_g1 < size) hasher.Store(dict,0,_g1++);
	}
	,WarmupHashHashLongestMatch: function(size,dict,hasher) {
		var _g1 = 0;
		while(_g1 < size) hasher.Store(dict,0,_g1++);
	}
	,PrependCustomDictionary: function(type,size,dict) {
		switch(type) {
		case 1:
			this.WarmupHashHashLongestMatchQuickly(size,dict,this.hash_h1);
			break;
		case 2:
			this.WarmupHashHashLongestMatchQuickly(size,dict,this.hash_h2);
			break;
		case 3:
			this.WarmupHashHashLongestMatchQuickly(size,dict,this.hash_h3);
			break;
		case 4:
			this.WarmupHashHashLongestMatchQuickly(size,dict,this.hash_h4);
			break;
		case 5:
			this.WarmupHashHashLongestMatch(size,dict,this.hash_h5);
			break;
		case 6:
			this.WarmupHashHashLongestMatch(size,dict,this.hash_h6);
			break;
		case 7:
			this.WarmupHashHashLongestMatch(size,dict,this.hash_h7);
			break;
		case 8:
			this.WarmupHashHashLongestMatch(size,dict,this.hash_h8);
			break;
		case 9:
			this.WarmupHashHashLongestMatch(size,dict,this.hash_h9);
			break;
		default:
		}
	}
	,__class__: encode_hash_Hashers
};
var encode_histogram_Histogram = function(kDataSize) {
	this.kDataSize = kDataSize;
	this.data_ = new Array(kDataSize);
	this.Clear();
};
encode_histogram_Histogram.__name__ = true;
encode_histogram_Histogram.prototype = {
	Clear: function() {
		DefaultFunctions.memset_Int(this.data_,0,0,this.data_.length);
		this.total_count_ = 0;
	}
	,Add1: function(val) {
		this.data_[val] += 1;
		++this.total_count_;
	}
	,Remove: function(val) {
		this.data_[val] -= 1;
		--this.total_count_;
	}
	,Add2: function(p,p_off,n) {
		this.total_count_ += n;
		++n;
		while(--n > 0) this.data_[p[p_off++]] += 1;
	}
	,AddHistogram: function(v) {
		this.total_count_ += v.total_count_;
		var _g1 = 0;
		var _g = this.kDataSize;
		while(_g1 < _g) {
			var i = _g1++;
			this.data_[i] += v.data_[i];
		}
	}
	,__class__: encode_histogram_Histogram
};
var encode_metablock_BlockSplit = function() {
	this.lengths = [];
	this.types = [];
	this.num_types = 0;
};
encode_metablock_BlockSplit.__name__ = true;
encode_metablock_BlockSplit.prototype = {
	__class__: encode_metablock_BlockSplit
};
var encode_metablock_BlockSplitter = function(HistogramTypeInt,alphabet_size,min_block_size,split_threshold,num_symbols,split,histograms) {
	this.last_entropy_ = [];
	this.last_histogram_ix_ = [];
	this.HistogramTypeInt = HistogramTypeInt;
	this.alphabet_size_ = alphabet_size;
	this.min_block_size_ = min_block_size;
	this.split_threshold_ = split_threshold;
	this.num_blocks_ = 0;
	this.split_ = split;
	this.histograms_ = histograms;
	this.target_block_size_ = min_block_size;
	this.block_size_ = 0;
	this.curr_histogram_ix_ = 0;
	this.merge_last_count_ = 0;
	var max_num_types = Math.min((num_symbols / min_block_size | 0) + 1,encode_metablock_BlockSplitter.kMaxBlockTypes + 1) | 0;
	this.split_.lengths = [];
	this.split_.types = [];
	var _g1 = 0;
	while(_g1 < max_num_types) {
		++_g1;
		this.histograms_.push(new encode_histogram_Histogram(HistogramTypeInt));
	}
	this.last_histogram_ix_[1] = 0;
	this.last_histogram_ix_[0] = 0;
};
encode_metablock_BlockSplitter.__name__ = true;
encode_metablock_BlockSplitter.prototype = {
	AddSymbol: function(symbol) {
		this.histograms_[this.curr_histogram_ix_].Add1(symbol);
		++this.block_size_;
		if(this.block_size_ == this.target_block_size_) {
			this.FinishBlock(false);
		}
	}
	,FinishBlock: function(is_final) {
		if(this.block_size_ < this.min_block_size_) {
			this.block_size_ = this.min_block_size_;
		}
		if(this.num_blocks_ == 0) {
			this.split_.lengths[0] = this.block_size_;
			this.split_.types[0] = 0;
			this.last_entropy_[0] = encode_Bit_$cost.BitsEntropy(this.histograms_[0].data_,0,this.alphabet_size_);
			this.last_entropy_[1] = this.last_entropy_[0];
			++this.num_blocks_;
			++this.split_.num_types;
			++this.curr_histogram_ix_;
			this.block_size_ = 0;
		} else if(this.block_size_ > 0) {
			var entropy = encode_Bit_$cost.BitsEntropy(this.histograms_[this.curr_histogram_ix_].data_,0,this.alphabet_size_);
			var combined_histo = [new encode_histogram_Histogram(this.HistogramTypeInt),new encode_histogram_Histogram(this.HistogramTypeInt)];
			var combined_entropy = FunctionMalloc.mallocFloat(2);
			var diff = FunctionMalloc.mallocFloat(2);
			var _g = 0;
			while(_g < 2) {
				var j = _g++;
				var last_histogram_ix = this.last_histogram_ix_[j];
				combined_histo[j].bit_cost_ = this.histograms_[this.curr_histogram_ix_].bit_cost_;
				var _g2 = 0;
				var _g1 = this.histograms_[this.curr_histogram_ix_].data_.length;
				while(_g2 < _g1) {
					var a = _g2++;
					combined_histo[j].data_[a] = this.histograms_[this.curr_histogram_ix_].data_[a];
				}
				combined_histo[j].kDataSize = this.histograms_[this.curr_histogram_ix_].kDataSize;
				combined_histo[j].total_count_ = this.histograms_[this.curr_histogram_ix_].total_count_;
				combined_histo[j].AddHistogram(this.histograms_[last_histogram_ix]);
				combined_entropy[j] = encode_Bit_$cost.BitsEntropy(combined_histo[j].data_,0,this.alphabet_size_);
				diff[j] = combined_entropy[j] - entropy - this.last_entropy_[j];
			}
			if(this.split_.num_types < encode_metablock_BlockSplitter.kMaxBlockTypes && diff[0] > this.split_threshold_ && diff[1] > this.split_threshold_) {
				this.split_.lengths[this.num_blocks_] = this.block_size_;
				this.split_.types[this.num_blocks_] = this.split_.num_types;
				this.last_histogram_ix_[1] = this.last_histogram_ix_[0];
				this.last_histogram_ix_[0] = this.split_.num_types;
				this.last_entropy_[1] = this.last_entropy_[0];
				this.last_entropy_[0] = entropy;
				++this.num_blocks_;
				++this.split_.num_types;
				++this.curr_histogram_ix_;
				this.block_size_ = 0;
				this.merge_last_count_ = 0;
				this.target_block_size_ = this.min_block_size_;
			} else if(diff[1] < diff[0] - 20.0) {
				this.split_.lengths[this.num_blocks_] = this.block_size_;
				this.split_.types[this.num_blocks_] = this.split_.types[this.num_blocks_ - 2];
				var t = this.last_histogram_ix_[0];
				this.last_histogram_ix_[0] = this.last_histogram_ix_[1];
				this.last_histogram_ix_[1] = t;
				this.histograms_[this.last_histogram_ix_[0]].bit_cost_ = combined_histo[1].bit_cost_;
				var _g11 = 0;
				var _g3 = combined_histo[1].data_.length;
				while(_g11 < _g3) {
					var a1 = _g11++;
					this.histograms_[this.last_histogram_ix_[0]].data_[a1] = combined_histo[1].data_[a1];
				}
				this.histograms_[this.last_histogram_ix_[0]].kDataSize = combined_histo[1].kDataSize;
				this.histograms_[this.last_histogram_ix_[0]].total_count_ = combined_histo[1].total_count_;
				this.last_entropy_[1] = this.last_entropy_[0];
				this.last_entropy_[0] = combined_entropy[1];
				++this.num_blocks_;
				this.block_size_ = 0;
				this.histograms_[this.curr_histogram_ix_].Clear();
				this.merge_last_count_ = 0;
				this.target_block_size_ = this.min_block_size_;
			} else {
				this.split_.lengths[this.num_blocks_ - 1] += this.block_size_;
				this.histograms_[this.last_histogram_ix_[0]].bit_cost_ = combined_histo[0].bit_cost_;
				var _g12 = 0;
				var _g4 = combined_histo[0].data_.length;
				while(_g12 < _g4) {
					var a2 = _g12++;
					this.histograms_[this.last_histogram_ix_[0]].data_[a2] = combined_histo[0].data_[a2];
				}
				this.histograms_[this.last_histogram_ix_[0]].kDataSize = combined_histo[0].kDataSize;
				this.histograms_[this.last_histogram_ix_[0]].total_count_ = combined_histo[0].total_count_;
				this.last_entropy_[0] = combined_entropy[0];
				if(this.split_.num_types == 1) {
					this.last_entropy_[1] = this.last_entropy_[0];
				}
				this.block_size_ = 0;
				this.histograms_[this.curr_histogram_ix_].Clear();
				if(++this.merge_last_count_ > 1) {
					this.target_block_size_ += this.min_block_size_;
				}
			}
		}
		if(is_final) {
			while(this.histograms_.length > this.split_.num_types) this.histograms_.pop();
			while(this.split_.types.length > this.num_blocks_) this.split_.types.pop();
			while(this.split_.lengths.length > this.num_blocks_) this.split_.lengths.pop();
		}
	}
	,__class__: encode_metablock_BlockSplitter
};
var encode_metablock_ContextBlockSplitter = function(HistogramTypeInt,alphabet_size,num_contexts,min_block_size,split_threshold,num_symbols,split,histograms) {
	this.last_histogram_ix_ = new Array(2);
	this.HistogramTypeInt = HistogramTypeInt;
	this.alphabet_size_ = alphabet_size;
	this.num_contexts_ = num_contexts;
	this.max_block_types_ = encode_metablock_ContextBlockSplitter.kMaxBlockTypes / num_contexts | 0;
	this.min_block_size_ = min_block_size;
	this.split_threshold_ = split_threshold;
	this.num_blocks_ = 0;
	this.split_ = split;
	this.histograms_ = histograms;
	this.target_block_size_ = min_block_size;
	this.block_size_ = 0;
	this.curr_histogram_ix_ = 0;
	this.last_entropy_ = FunctionMalloc.mallocFloat(2 * num_contexts);
	this.merge_last_count_ = 0;
	var max_num_types = Math.min((num_symbols / min_block_size | 0) + 1,this.max_block_types_ + 1) | 0;
	this.split_.lengths = [];
	this.split_.types = [];
	var _g1 = 0;
	var _g = max_num_types * num_contexts;
	while(_g1 < _g) {
		++_g1;
		this.histograms_.push(new encode_histogram_Histogram(HistogramTypeInt));
	}
	this.last_histogram_ix_[1] = 0;
	this.last_histogram_ix_[0] = 0;
};
encode_metablock_ContextBlockSplitter.__name__ = true;
encode_metablock_ContextBlockSplitter.prototype = {
	AddSymbol: function(symbol,context) {
		this.histograms_[this.curr_histogram_ix_ + context].Add1(symbol);
		++this.block_size_;
		if(this.block_size_ == this.target_block_size_) {
			this.FinishBlock(false);
		}
	}
	,FinishBlock: function(is_final) {
		if(this.block_size_ < this.min_block_size_) {
			this.block_size_ = this.min_block_size_;
		}
		if(this.num_blocks_ == 0) {
			this.split_.lengths[0] = this.block_size_;
			this.split_.types[0] = 0;
			var _g1 = 0;
			var _g = this.num_contexts_;
			while(_g1 < _g) {
				var i = _g1++;
				this.last_entropy_[i] = encode_Bit_$cost.BitsEntropy(this.histograms_[i].data_,0,this.alphabet_size_);
				this.last_entropy_[this.num_contexts_ + i] = this.last_entropy_[i];
			}
			++this.num_blocks_;
			++this.split_.num_types;
			this.curr_histogram_ix_ += this.num_contexts_;
			this.block_size_ = 0;
		} else if(this.block_size_ > 0) {
			var length = this.num_contexts_;
			var entropy = new Array(length);
			var length1 = 2 * this.num_contexts_;
			var combined_histo = new Array(length1);
			var _g11 = 0;
			var _g2 = 2 * this.num_contexts_;
			while(_g11 < _g2) combined_histo[_g11++] = new encode_histogram_Histogram(this.HistogramTypeInt);
			var length2 = 2 * this.num_contexts_;
			var combined_entropy = new Array(length2);
			var diff = [0.0,0.0];
			var _g12 = 0;
			var _g3 = this.num_contexts_;
			while(_g12 < _g3) {
				var i1 = _g12++;
				var curr_histo_ix = this.curr_histogram_ix_ + i1;
				entropy[i1] = encode_Bit_$cost.BitsEntropy(this.histograms_[curr_histo_ix].data_,0,this.alphabet_size_);
				var _g21 = 0;
				while(_g21 < 2) {
					var j = _g21++;
					var jx = j * this.num_contexts_ + i1;
					var last_histogram_ix = this.last_histogram_ix_[j] + i1;
					combined_histo[jx].bit_cost_ = this.histograms_[curr_histo_ix].bit_cost_;
					var _g4 = 0;
					var _g31 = this.histograms_[curr_histo_ix].data_.length;
					while(_g4 < _g31) {
						var a = _g4++;
						combined_histo[jx].data_[a] = this.histograms_[curr_histo_ix].data_[a];
					}
					combined_histo[jx].kDataSize = this.histograms_[curr_histo_ix].kDataSize;
					combined_histo[jx].total_count_ = this.histograms_[curr_histo_ix].total_count_;
					combined_histo[jx].AddHistogram(this.histograms_[last_histogram_ix]);
					combined_entropy[jx] = encode_Bit_$cost.BitsEntropy(combined_histo[jx].data_,0,this.alphabet_size_);
					diff[j] += combined_entropy[jx] - entropy[i1] - this.last_entropy_[jx];
				}
			}
			if(this.split_.num_types < this.max_block_types_ && diff[0] > this.split_threshold_ && diff[1] > this.split_threshold_) {
				this.split_.lengths[this.num_blocks_] = this.block_size_;
				this.split_.types[this.num_blocks_] = this.split_.num_types;
				this.last_histogram_ix_[1] = this.last_histogram_ix_[0];
				this.last_histogram_ix_[0] = this.split_.num_types * this.num_contexts_;
				var _g13 = 0;
				var _g5 = this.num_contexts_;
				while(_g13 < _g5) {
					var i2 = _g13++;
					this.last_entropy_[this.num_contexts_ + i2] = this.last_entropy_[i2];
					this.last_entropy_[i2] = entropy[i2];
				}
				++this.num_blocks_;
				++this.split_.num_types;
				this.curr_histogram_ix_ += this.num_contexts_;
				this.block_size_ = 0;
				this.merge_last_count_ = 0;
				this.target_block_size_ = this.min_block_size_;
			} else if(diff[1] < diff[0] - 20.0) {
				this.split_.lengths[this.num_blocks_] = this.block_size_;
				this.split_.types[this.num_blocks_] = this.split_.types[this.num_blocks_ - 2];
				var t = this.last_histogram_ix_[0];
				this.last_histogram_ix_[0] = this.last_histogram_ix_[1];
				this.last_histogram_ix_[1] = t;
				var _g14 = 0;
				var _g6 = this.num_contexts_;
				while(_g14 < _g6) {
					var i3 = _g14++;
					this.histograms_[this.last_histogram_ix_[0] + i3].bit_cost_ = combined_histo[this.num_contexts_ + i3].bit_cost_;
					var _g32 = 0;
					var _g22 = combined_histo[this.num_contexts_ + i3].data_.length;
					while(_g32 < _g22) {
						var a1 = _g32++;
						this.histograms_[this.last_histogram_ix_[0] + i3].data_[a1] = combined_histo[this.num_contexts_ + i3].data_[a1];
					}
					this.histograms_[this.last_histogram_ix_[0] + i3].kDataSize = combined_histo[this.num_contexts_ + i3].kDataSize;
					this.histograms_[this.last_histogram_ix_[0] + i3].total_count_ = combined_histo[this.num_contexts_ + i3].total_count_;
					this.last_entropy_[this.num_contexts_ + i3] = this.last_entropy_[i3];
					this.last_entropy_[i3] = combined_entropy[this.num_contexts_ + i3];
					this.histograms_[this.curr_histogram_ix_ + i3].Clear();
				}
				++this.num_blocks_;
				this.block_size_ = 0;
				this.merge_last_count_ = 0;
				this.target_block_size_ = this.min_block_size_;
			} else {
				this.split_.lengths[this.num_blocks_ - 1] += this.block_size_;
				var _g15 = 0;
				var _g7 = this.num_contexts_;
				while(_g15 < _g7) {
					var i4 = _g15++;
					this.histograms_[this.last_histogram_ix_[0] + i4].bit_cost_ = combined_histo[i4].bit_cost_;
					var _g33 = 0;
					var _g23 = combined_histo[i4].data_.length;
					while(_g33 < _g23) {
						var a2 = _g33++;
						this.histograms_[this.last_histogram_ix_[0] + i4].data_[a2] = combined_histo[i4].data_[a2];
					}
					this.histograms_[this.last_histogram_ix_[0] + i4].kDataSize = combined_histo[i4].kDataSize;
					this.histograms_[this.last_histogram_ix_[0] + i4].total_count_ = combined_histo[i4].total_count_;
					this.last_entropy_[i4] = combined_entropy[i4];
					if(this.split_.num_types == 1) {
						this.last_entropy_[this.num_contexts_ + i4] = this.last_entropy_[i4];
					}
					this.histograms_[this.curr_histogram_ix_ + i4].Clear();
				}
				this.block_size_ = 0;
				if(++this.merge_last_count_ > 1) {
					this.target_block_size_ += this.min_block_size_;
				}
			}
		}
		if(is_final) {
			while(this.histograms_.length > this.split_.num_types * this.num_contexts_) this.histograms_.pop();
			while(this.split_.types.length > this.num_blocks_) this.split_.types.pop();
			while(this.split_.lengths.length > this.num_blocks_) this.split_.lengths.pop();
		}
	}
	,__class__: encode_metablock_ContextBlockSplitter
};
var encode_metablock_MetaBlockSplit = function() {
	this.distance_histograms = [];
	this.command_histograms = [];
	this.literal_histograms = [];
	this.distance_context_map = new Array(0);
	this.literal_context_map = new Array(0);
	this.distance_split = new encode_metablock_BlockSplit();
	this.command_split = new encode_metablock_BlockSplit();
	this.literal_split = new encode_metablock_BlockSplit();
};
encode_metablock_MetaBlockSplit.__name__ = true;
encode_metablock_MetaBlockSplit.prototype = {
	__class__: encode_metablock_MetaBlockSplit
};
var encode_static_$dict_$lut_DictWord = function(len,transform,idx) {
	this.len = len;
	this.transform = transform;
	this.idx = idx;
};
encode_static_$dict_$lut_DictWord.__name__ = true;
encode_static_$dict_$lut_DictWord.prototype = {
	__class__: encode_static_$dict_$lut_DictWord
};
var encode_streams_BrotliIn = function() { };
encode_streams_BrotliIn.__name__ = true;
var encode_streams_BrotliMemIn = function(buf,len) {
	this.buf_ = buf;
	this.len_ = len;
	this.pos_ = 0;
};
encode_streams_BrotliMemIn.__name__ = true;
encode_streams_BrotliMemIn.prototype = {
	position: function() {
		return this.pos_;
	}
	,Reset: function(buf,len) {
		this.buf_ = buf;
		this.len_ = len;
		this.pos_ = 0;
	}
	,Read: function(n,output) {
		if(this.pos_ == this.len_) {
			return null;
		}
		if(n > this.len_ - this.pos_) {
			n = this.len_ - this.pos_;
		}
		var p = new Array(n);
		DefaultFunctions.memcpyVectorArray(p,0,this.buf_,this.pos_,n);
		this.pos_ += n;
		output[0] = n;
		return p;
	}
	,__class__: encode_streams_BrotliMemIn
};
var encode_streams_BrotliMemOut = function(buf) {
	this.buf_ = buf;
	this.pos_ = 0;
};
encode_streams_BrotliMemOut.__name__ = true;
encode_streams_BrotliMemOut.prototype = {
	position: function() {
		return this.pos_;
	}
	,Reset: function(buf,len) {
		this.buf_ = buf;
		this.pos_ = 0;
	}
	,Write: function(buf,n) {
		DefaultFunctions.memcpyArrayVector(this.buf_,this.pos_,buf,0,n);
		this.pos_ += n;
		return true;
	}
	,__class__: encode_streams_BrotliMemOut
};
var encode_streams_BrotliOut = function() { };
encode_streams_BrotliOut.__name__ = true;
var haxe__$Int32_Int32_$Impl_$ = {};
haxe__$Int32_Int32_$Impl_$.__name__ = true;
haxe__$Int32_Int32_$Impl_$.ucompare = function(a,b) {
	if(a < 0) {
		if(b < 0) {
			return ~b - ~a | 0;
		} else {
			return 1;
		}
	}
	if(b < 0) {
		return -1;
	} else {
		return a - b | 0;
	}
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.prototype = {
	getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		}
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) {
					break;
				}
				s += fcc(c);
			} else if(c < 224) {
				s += fcc((c & 63) << 6 | b[i++] & 127);
			} else if(c < 240) {
				s += fcc((c & 31) << 12 | (b[i++] & 127) << 6 | b[i++] & 127);
			} else {
				var u = (c & 15) << 18 | (b[i++] & 127) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = intf[_g1++];
			if(i == cl || js_Boot.__interfLoop(i,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		if((o instanceof Array)) {
			return o.__enum__ == null;
		} else {
			return false;
		}
		break;
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return true;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return (o|0) === o;
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					return true;
				}
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return window[name];
};
var js_Browser = function() { };
js_Browser.__name__ = true;
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	}
	if(typeof ActiveXObject != "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g1 = 0;
		var _g = len;
		while(_g1 < _g) this.a[_g1++] = 0;
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var result = new ArrayBuffer(u.byteLength);
	new Uint8Array(result).set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g1 = 0;
		var _g = arg1;
		while(_g1 < _g) {
			var i = _g1++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) {
			offset = 0;
		}
		if(length == null) {
			length = buffer.byteLength - offset;
		}
		if(offset == 0) {
			arr = buffer.a;
		} else {
			arr = buffer.a.slice(offset,offset + length);
		}
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else {
		throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	}
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			this[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this[i1 + offset] = a1[i1];
		}
	} else {
		throw new js__$Boot_HaxeError("TODO");
	}
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var a = js_html_compat_Uint8Array._new(this.slice(start,end));
	a.byteOffset = start;
	return a;
};

var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var ArrayBuffer = window.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
}
var Uint8Array = window.Uint8Array || js_html_compat_Uint8Array._new;
decode_Decode.kDefaultCodeLength = 8;
decode_Decode.kCodeLengthRepeatCode = 16;
decode_Decode.kNumLiteralCodes = 256;
decode_Decode.kNumInsertAndCopyCodes = 704;
decode_Decode.kNumBlockLengthCodes = 26;
decode_Decode.kLiteralContextBits = 6;
decode_Decode.kDistanceContextBits = 2;
decode_Decode.HUFFMAN_TABLE_BITS = 8;
decode_Decode.HUFFMAN_TABLE_MASK = 255;
decode_Decode.CODE_LENGTH_CODES = 18;
decode_Decode.kCodeLengthCodeOrder = [1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15];
decode_Decode.NUM_DISTANCE_SHORT_CODES = 16;
decode_Decode.kDistanceShortCodeIndexOffset = [3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2];
decode_Decode.kDistanceShortCodeValueOffset = [0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3];
decode_BitReader.BROTLI_MAX_NUM_BIT_READ = 25;
decode_BitReader.BROTLI_READ_SIZE = 4096;
decode_BitReader.BROTLI_IBUF_SIZE = 8320;
decode_BitReader.BROTLI_IBUF_MASK = 8191;
decode_BitReader.kBitMask = [0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215];
decode_Context.kContextLookup = [0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
decode_Context.kContextLookupOffsets = [1024,1536,1280,1536,0,256,768,512];
decode_Dictionary.kBrotliDictionaryOffsetsByLength = [0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016];
decode_Dictionary.kBrotliDictionarySizeBitsByLength = [0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5];
decode_Dictionary.kMinDictionaryWordLength = 4;
decode_Dictionary.kMaxDictionaryWordLength = 24;
decode_Huffman.BROTLI_HUFFMAN_MAX_TABLE_SIZE = 1080;
decode_Huffman.MAX_LENGTH = 15;
decode_Huffman.MAX_CODE_LENGTHS_SIZE = 704;
decode_Prefix.kBlockLengthPrefixCode = [new decode_prefix_PrefixCodeRange(1,2),new decode_prefix_PrefixCodeRange(5,2),new decode_prefix_PrefixCodeRange(9,2),new decode_prefix_PrefixCodeRange(13,2),new decode_prefix_PrefixCodeRange(17,3),new decode_prefix_PrefixCodeRange(25,3),new decode_prefix_PrefixCodeRange(33,3),new decode_prefix_PrefixCodeRange(41,3),new decode_prefix_PrefixCodeRange(49,4),new decode_prefix_PrefixCodeRange(65,4),new decode_prefix_PrefixCodeRange(81,4),new decode_prefix_PrefixCodeRange(97,4),new decode_prefix_PrefixCodeRange(113,5),new decode_prefix_PrefixCodeRange(145,5),new decode_prefix_PrefixCodeRange(177,5),new decode_prefix_PrefixCodeRange(209,5),new decode_prefix_PrefixCodeRange(241,6),new decode_prefix_PrefixCodeRange(305,6),new decode_prefix_PrefixCodeRange(369,7),new decode_prefix_PrefixCodeRange(497,8),new decode_prefix_PrefixCodeRange(753,9),new decode_prefix_PrefixCodeRange(1265,10),new decode_prefix_PrefixCodeRange(2289,11),new decode_prefix_PrefixCodeRange(4337,12),new decode_prefix_PrefixCodeRange(8433,13),new decode_prefix_PrefixCodeRange(16625,24)];
decode_Prefix.kInsertLengthPrefixCode = [new decode_prefix_PrefixCodeRange(0,0),new decode_prefix_PrefixCodeRange(1,0),new decode_prefix_PrefixCodeRange(2,0),new decode_prefix_PrefixCodeRange(3,0),new decode_prefix_PrefixCodeRange(4,0),new decode_prefix_PrefixCodeRange(5,0),new decode_prefix_PrefixCodeRange(6,1),new decode_prefix_PrefixCodeRange(8,1),new decode_prefix_PrefixCodeRange(10,2),new decode_prefix_PrefixCodeRange(14,2),new decode_prefix_PrefixCodeRange(18,3),new decode_prefix_PrefixCodeRange(26,3),new decode_prefix_PrefixCodeRange(34,4),new decode_prefix_PrefixCodeRange(50,4),new decode_prefix_PrefixCodeRange(66,5),new decode_prefix_PrefixCodeRange(98,5),new decode_prefix_PrefixCodeRange(130,6),new decode_prefix_PrefixCodeRange(194,7),new decode_prefix_PrefixCodeRange(322,8),new decode_prefix_PrefixCodeRange(578,9),new decode_prefix_PrefixCodeRange(1090,10),new decode_prefix_PrefixCodeRange(2114,12),new decode_prefix_PrefixCodeRange(6210,14),new decode_prefix_PrefixCodeRange(22594,24)];
decode_Prefix.kCopyLengthPrefixCode = [new decode_prefix_PrefixCodeRange(2,0),new decode_prefix_PrefixCodeRange(3,0),new decode_prefix_PrefixCodeRange(4,0),new decode_prefix_PrefixCodeRange(5,0),new decode_prefix_PrefixCodeRange(6,0),new decode_prefix_PrefixCodeRange(7,0),new decode_prefix_PrefixCodeRange(8,0),new decode_prefix_PrefixCodeRange(9,0),new decode_prefix_PrefixCodeRange(10,1),new decode_prefix_PrefixCodeRange(12,1),new decode_prefix_PrefixCodeRange(14,2),new decode_prefix_PrefixCodeRange(18,2),new decode_prefix_PrefixCodeRange(22,3),new decode_prefix_PrefixCodeRange(30,3),new decode_prefix_PrefixCodeRange(38,4),new decode_prefix_PrefixCodeRange(54,4),new decode_prefix_PrefixCodeRange(70,5),new decode_prefix_PrefixCodeRange(102,5),new decode_prefix_PrefixCodeRange(134,6),new decode_prefix_PrefixCodeRange(198,7),new decode_prefix_PrefixCodeRange(326,8),new decode_prefix_PrefixCodeRange(582,9),new decode_prefix_PrefixCodeRange(1094,10),new decode_prefix_PrefixCodeRange(2118,24)];
decode_Prefix.kInsertRangeLut = [0,0,8,8,0,16,8,16,16];
decode_Prefix.kCopyRangeLut = [0,8,0,8,16,0,16,8,16];
decode_Transforms.kIdentity = 0;
decode_Transforms.kOmitLast1 = 1;
decode_Transforms.kOmitLast2 = 2;
decode_Transforms.kOmitLast3 = 3;
decode_Transforms.kOmitLast4 = 4;
decode_Transforms.kOmitLast5 = 5;
decode_Transforms.kOmitLast6 = 6;
decode_Transforms.kOmitLast7 = 7;
decode_Transforms.kOmitLast8 = 8;
decode_Transforms.kOmitLast9 = 9;
decode_Transforms.kUppercaseFirst = 10;
decode_Transforms.kUppercaseAll = 11;
decode_Transforms.kOmitFirst1 = 12;
decode_Transforms.kOmitFirst2 = 13;
decode_Transforms.kOmitFirst3 = 14;
decode_Transforms.kOmitFirst4 = 15;
decode_Transforms.kOmitFirst5 = 16;
decode_Transforms.kOmitFirst6 = 17;
decode_Transforms.kOmitFirst7 = 18;
decode_Transforms.kOmitFirst8 = 19;
decode_Transforms.kOmitFirst9 = 20;
decode_Transforms.kTransforms = [new decode_transform_Transform("",decode_Transforms.kIdentity,""),new decode_transform_Transform("",decode_Transforms.kIdentity," "),new decode_transform_Transform(" ",decode_Transforms.kIdentity," "),new decode_transform_Transform("",decode_Transforms.kOmitFirst1,""),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst," "),new decode_transform_Transform("",decode_Transforms.kIdentity," the "),new decode_transform_Transform(" ",decode_Transforms.kIdentity,""),new decode_transform_Transform("s ",decode_Transforms.kIdentity," "),new decode_transform_Transform("",decode_Transforms.kIdentity," of "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,""),new decode_transform_Transform("",decode_Transforms.kIdentity," and "),new decode_transform_Transform("",decode_Transforms.kOmitFirst2,""),new decode_transform_Transform("",decode_Transforms.kOmitLast1,""),new decode_transform_Transform(", ",decode_Transforms.kIdentity," "),new decode_transform_Transform("",decode_Transforms.kIdentity,", "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst," "),new decode_transform_Transform("",decode_Transforms.kIdentity," in "),new decode_transform_Transform("",decode_Transforms.kIdentity," to "),new decode_transform_Transform("e ",decode_Transforms.kIdentity," "),new decode_transform_Transform("",decode_Transforms.kIdentity,"\""),new decode_transform_Transform("",decode_Transforms.kIdentity,"."),new decode_transform_Transform("",decode_Transforms.kIdentity,"\">"),new decode_transform_Transform("",decode_Transforms.kIdentity,"\n"),new decode_transform_Transform("",decode_Transforms.kOmitLast3,""),new decode_transform_Transform("",decode_Transforms.kIdentity,"]"),new decode_transform_Transform("",decode_Transforms.kIdentity," for "),new decode_transform_Transform("",decode_Transforms.kOmitFirst3,""),new decode_transform_Transform("",decode_Transforms.kOmitLast2,""),new decode_transform_Transform("",decode_Transforms.kIdentity," a "),new decode_transform_Transform("",decode_Transforms.kIdentity," that "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,""),new decode_transform_Transform("",decode_Transforms.kIdentity,". "),new decode_transform_Transform(".",decode_Transforms.kIdentity,""),new decode_transform_Transform(" ",decode_Transforms.kIdentity,", "),new decode_transform_Transform("",decode_Transforms.kOmitFirst4,""),new decode_transform_Transform("",decode_Transforms.kIdentity," with "),new decode_transform_Transform("",decode_Transforms.kIdentity,"'"),new decode_transform_Transform("",decode_Transforms.kIdentity," from "),new decode_transform_Transform("",decode_Transforms.kIdentity," by "),new decode_transform_Transform("",decode_Transforms.kOmitFirst5,""),new decode_transform_Transform("",decode_Transforms.kOmitFirst6,""),new decode_transform_Transform(" the ",decode_Transforms.kIdentity,""),new decode_transform_Transform("",decode_Transforms.kOmitLast4,""),new decode_transform_Transform("",decode_Transforms.kIdentity,". The "),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,""),new decode_transform_Transform("",decode_Transforms.kIdentity," on "),new decode_transform_Transform("",decode_Transforms.kIdentity," as "),new decode_transform_Transform("",decode_Transforms.kIdentity," is "),new decode_transform_Transform("",decode_Transforms.kOmitLast7,""),new decode_transform_Transform("",decode_Transforms.kOmitLast1,"ing "),new decode_transform_Transform("",decode_Transforms.kIdentity,"\n\t"),new decode_transform_Transform("",decode_Transforms.kIdentity,":"),new decode_transform_Transform(" ",decode_Transforms.kIdentity,". "),new decode_transform_Transform("",decode_Transforms.kIdentity,"ed "),new decode_transform_Transform("",decode_Transforms.kOmitFirst9,""),new decode_transform_Transform("",decode_Transforms.kOmitFirst7,""),new decode_transform_Transform("",decode_Transforms.kOmitLast6,""),new decode_transform_Transform("",decode_Transforms.kIdentity,"("),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,", "),new decode_transform_Transform("",decode_Transforms.kOmitLast8,""),new decode_transform_Transform("",decode_Transforms.kIdentity," at "),new decode_transform_Transform("",decode_Transforms.kIdentity,"ly "),new decode_transform_Transform(" the ",decode_Transforms.kIdentity," of "),new decode_transform_Transform("",decode_Transforms.kOmitLast5,""),new decode_transform_Transform("",decode_Transforms.kOmitLast9,""),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,", "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"\""),new decode_transform_Transform(".",decode_Transforms.kIdentity,"("),new decode_transform_Transform("",decode_Transforms.kUppercaseAll," "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"\">"),new decode_transform_Transform("",decode_Transforms.kIdentity,"=\""),new decode_transform_Transform(" ",decode_Transforms.kIdentity,"."),new decode_transform_Transform(".com/",decode_Transforms.kIdentity,""),new decode_transform_Transform(" the ",decode_Transforms.kIdentity," of the "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"'"),new decode_transform_Transform("",decode_Transforms.kIdentity,". This "),new decode_transform_Transform("",decode_Transforms.kIdentity,","),new decode_transform_Transform(".",decode_Transforms.kIdentity," "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"("),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"."),new decode_transform_Transform("",decode_Transforms.kIdentity," not "),new decode_transform_Transform(" ",decode_Transforms.kIdentity,"=\""),new decode_transform_Transform("",decode_Transforms.kIdentity,"er "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll," "),new decode_transform_Transform("",decode_Transforms.kIdentity,"al "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,""),new decode_transform_Transform("",decode_Transforms.kIdentity,"='"),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"\""),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,". "),new decode_transform_Transform(" ",decode_Transforms.kIdentity,"("),new decode_transform_Transform("",decode_Transforms.kIdentity,"ful "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,". "),new decode_transform_Transform("",decode_Transforms.kIdentity,"ive "),new decode_transform_Transform("",decode_Transforms.kIdentity,"less "),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"'"),new decode_transform_Transform("",decode_Transforms.kIdentity,"est "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,"."),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"\">"),new decode_transform_Transform(" ",decode_Transforms.kIdentity,"='"),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,","),new decode_transform_Transform("",decode_Transforms.kIdentity,"ize "),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"."),new decode_transform_Transform(" ",decode_Transforms.kIdentity,""),new decode_transform_Transform(" ",decode_Transforms.kIdentity,","),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"=\""),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"=\""),new decode_transform_Transform("",decode_Transforms.kIdentity,"ous "),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,", "),new decode_transform_Transform("",decode_Transforms.kUppercaseFirst,"='"),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,","),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,"=\""),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,", "),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,","),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"("),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,". "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,"."),new decode_transform_Transform("",decode_Transforms.kUppercaseAll,"='"),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,". "),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,"=\""),new decode_transform_Transform(" ",decode_Transforms.kUppercaseAll,"='"),new decode_transform_Transform(" ",decode_Transforms.kUppercaseFirst,"='")];
decode_Transforms.kNumTransforms = decode_Transforms.kTransforms.length;
encode_Backward_$references.kInfinity = Infinity;
encode_Block_$splitter.kMaxLiteralHistograms = 100;
encode_Block_$splitter.kMaxCommandHistograms = 50;
encode_Block_$splitter.kLiteralBlockSwitchCost = 28.1;
encode_Block_$splitter.kCommandBlockSwitchCost = 13.5;
encode_Block_$splitter.kDistanceBlockSwitchCost = 14.6;
encode_Block_$splitter.kLiteralStrideLength = 70;
encode_Block_$splitter.kCommandStrideLength = 40;
encode_Block_$splitter.kSymbolsPerLiteralHistogram = 544;
encode_Block_$splitter.kSymbolsPerCommandHistogram = 530;
encode_Block_$splitter.kSymbolsPerDistanceHistogram = 544;
encode_Block_$splitter.kMinLengthForBlockSplitting = 128;
encode_Block_$splitter.kIterMulForRefining = 2;
encode_Block_$splitter.kMinItersForRefining = 100;
encode_Command_$functions.insbase = [0,1,2,3,4,5,6,8,10,14,18,26,34,50,66,98,130,194,322,578,1090,2114,6210,22594];
encode_Command_$functions.insextra = [0,0,0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,7,8,9,10,12,14,24];
encode_Command_$functions.copybase = [2,3,4,5,6,7,8,9,10,12,14,18,22,30,38,54,70,102,134,198,326,582,1094,2118];
encode_Command_$functions.copyextra = [0,0,0,0,0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,7,8,9,10,24];
encode_Context.kUTF8ContextLookup = [0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
encode_Context.kSigned3BitContextLookup = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7];
encode_Context.CONTEXT_LSB6 = 0;
encode_Context.CONTEXT_MSB6 = 1;
encode_Context.CONTEXT_UTF8 = 2;
encode_Context.CONTEXT_SIGNED = 3;
encode_Dictionary.kBrotliDictionaryOffsetsByLength = [0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016];
encode_Dictionary.kBrotliDictionarySizeBitsByLength = [0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5];
encode_Dictionary.kMinDictionaryWordLength = 4;
encode_Dictionary.kMaxDictionaryWordLength = 24;
encode_Dictionary_$hash.kStaticDictionaryHash = [];
encode_Encode.kMaxWindowBits = 24;
encode_Encode.kMinWindowBits = 16;
encode_Encode.kMinInputBlockBits = 16;
encode_Encode.kMaxInputBlockBits = 24;
encode_Encode.kMinUTF8Ratio = 0.75;
encode_Encode.kMinQualityForBlockSplit = 4;
encode_Encode.kMinQualityForContextModeling = 5;
encode_Encode.kMinQualityForOptimizeHistograms = 4;
encode_Entropy_$encode.kCodeLengthCodes = 18;
encode_Fast_$log.kLog2Table = [0.0000000000000000,0.0000000000000000,1.0000000000000000,1.5849625007211563,2.0000000000000000,2.3219280948873622,2.5849625007211561,2.8073549220576042,3.0000000000000000,3.1699250014423126,3.3219280948873626,3.4594316186372978,3.5849625007211565,3.7004397181410922,3.8073549220576037,3.9068905956085187,4.0000000000000000,4.0874628412503400,4.1699250014423122,4.2479275134435852,4.3219280948873626,4.3923174227787607,4.4594316186372973,4.5235619560570131,4.5849625007211570,4.6438561897747244,4.7004397181410926,4.7548875021634691,4.8073549220576037,4.8579809951275728,4.9068905956085187,4.9541963103868758,5.0000000000000000,5.0443941193584534,5.0874628412503400,5.1292830169449664,5.1699250014423122,5.2094533656289501,5.2479275134435852,5.2854022188622487,5.3219280948873626,5.3575520046180838,5.3923174227787607,5.4262647547020979,5.4594316186372973,5.4918530963296748,5.5235619560570131,5.5545888516776376,5.5849625007211570,5.6147098441152083,5.6438561897747244,5.6724253419714961,5.7004397181410926,5.7279204545631996,5.7548875021634691,5.7813597135246599,5.8073549220576046,5.8328900141647422,5.8579809951275719,5.8826430493618416,5.9068905956085187,5.9307373375628867,5.9541963103868758,5.9772799234999168,6.0000000000000000,6.0223678130284544,6.0443941193584534,6.0660891904577721,6.0874628412503400,6.1085244567781700,6.1292830169449672,6.1497471195046822,6.1699250014423122,6.1898245588800176,6.2094533656289510,6.2288186904958804,6.2479275134435861,6.2667865406949019,6.2854022188622487,6.3037807481771031,6.3219280948873617,6.3398500028846252,6.3575520046180847,6.3750394313469254,6.3923174227787598,6.4093909361377026,6.4262647547020979,6.4429434958487288,6.4594316186372982,6.4757334309663976,6.4918530963296748,6.5077946401986964,6.5235619560570131,6.5391588111080319,6.5545888516776376,6.5698556083309478,6.5849625007211561,6.5999128421871278,6.6147098441152092,6.6293566200796095,6.6438561897747253,6.6582114827517955,6.6724253419714952,6.6865005271832185,6.7004397181410917,6.7142455176661224,6.7279204545631988,6.7414669864011465,6.7548875021634691,6.7681843247769260,6.7813597135246599,6.7944158663501062,6.8073549220576037,6.8201789624151887,6.8328900141647422,6.8454900509443757,6.8579809951275719,6.8703647195834048,6.8826430493618416,6.8948177633079437,6.9068905956085187,6.9188632372745955,6.9307373375628867,6.9425145053392399,6.9541963103868758,6.9657842846620879,6.9772799234999168,6.9886846867721664,7.0000000000000000,7.0112272554232540,7.0223678130284544,7.0334230015374501,7.0443941193584534,7.0552824355011898,7.0660891904577721,7.0768155970508317,7.0874628412503400,7.0980320829605272,7.1085244567781700,7.1189410727235076,7.1292830169449664,7.1395513523987937,7.1497471195046822,7.1598713367783891,7.1699250014423130,7.1799090900149345,7.1898245588800176,7.1996723448363644,7.2094533656289492,7.2191685204621621,7.2288186904958804,7.2384047393250794,7.2479275134435861,7.2573878426926521,7.2667865406949019,7.2761244052742384,7.2854022188622487,7.2946207488916270,7.3037807481771031,7.3128829552843557,7.3219280948873617,7.3309168781146177,7.3398500028846243,7.3487281542310781,7.3575520046180847,7.3663222142458151,7.3750394313469254,7.3837042924740528,7.3923174227787607,7.4008794362821844,7.4093909361377026,7.4178525148858991,7.4262647547020979,7.4346282276367255,7.4429434958487288,7.4512111118323299,7.4594316186372973,7.4676055500829976,7.4757334309663976,7.4838157772642564,7.4918530963296748,7.4998458870832057,7.5077946401986964,7.5156998382840436,7.5235619560570131,7.5313814605163119,7.5391588111080319,7.5468944598876373,7.5545888516776376,7.5622424242210728,7.5698556083309478,7.5774288280357487,7.5849625007211561,7.5924570372680806,7.5999128421871278,7.6073303137496113,7.6147098441152075,7.6220518194563764,7.6293566200796095,7.6366246205436488,7.6438561897747244,7.6510516911789290,7.6582114827517955,7.6653359171851765,7.6724253419714952,7.6794800995054464,7.6865005271832185,7.6934869574993252,7.7004397181410926,7.7073591320808825,7.7142455176661224,7.7210991887071856,7.7279204545631996,7.7347096202258392,7.7414669864011465,7.7481928495894596,7.7548875021634691,7.7615512324444795,7.7681843247769260,7.7747870596011737,7.7813597135246608,7.7879025593914317,7.7944158663501062,7.8008998999203047,7.8073549220576037,7.8137811912170374,7.8201789624151887,7.8265484872909159,7.8328900141647422,7.8392037880969445,7.8454900509443757,7.8517490414160571,7.8579809951275719,7.8641861446542798,7.8703647195834048,7.8765169465650002,7.8826430493618425,7.8887432488982601,7.8948177633079446,7.9008668079807496,7.9068905956085187,7.9128893362299619,7.9188632372745955,7.9248125036057813,7.9307373375628867,7.9366379390025719,7.9425145053392399,7.9483672315846778,7.9541963103868758,7.9600019320680806,7.9657842846620870,7.9715435539507720,7.9772799234999168,7.9829935746943104,7.9886846867721664,7.9943534368588578];
encode_Hash.kDistanceCacheIndex = [0,1,2,3,0,0,0,0,0,0,1,1,1,1,1,1];
encode_Hash.kDistanceCacheOffset = [0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3];
encode_Hash.kHashMul32 = 506832829;
encode_Hash.kMaxZopfliLen = 325;
encode_Histogram_$functions.HistogramLiteralInt = 256;
encode_Histogram_$functions.HistogramCommandInt = 704;
encode_Histogram_$functions.HistogramDistanceInt = 520;
encode_Histogram_$functions.HistogramBlockLengthInt = 26;
encode_Histogram_$functions.HistogramContextMapInt = 272;
encode_Histogram_$functions.HistogramBlockTypeInt = 258;
encode_Histogram_$functions.kLiteralContextBits = 6;
encode_Histogram_$functions.kDistanceContextBits = 2;
encode_Prefix.kNumInsertLenPrefixes = 24;
encode_Prefix.kNumCopyLenPrefixes = 24;
encode_Prefix.kNumCommandPrefixes = 704;
encode_Prefix.kNumBlockLenPrefixes = 26;
encode_Prefix.kNumDistanceShortCodes = 16;
encode_Prefix.kNumDistancePrefixes = 520;
encode_Prefix.kBlockLengthPrefixCode = [new encode_prefix_PrefixCodeRange(1,2),new encode_prefix_PrefixCodeRange(5,2),new encode_prefix_PrefixCodeRange(9,2),new encode_prefix_PrefixCodeRange(13,2),new encode_prefix_PrefixCodeRange(17,3),new encode_prefix_PrefixCodeRange(25,3),new encode_prefix_PrefixCodeRange(33,3),new encode_prefix_PrefixCodeRange(41,3),new encode_prefix_PrefixCodeRange(49,4),new encode_prefix_PrefixCodeRange(65,4),new encode_prefix_PrefixCodeRange(81,4),new encode_prefix_PrefixCodeRange(97,4),new encode_prefix_PrefixCodeRange(113,5),new encode_prefix_PrefixCodeRange(145,5),new encode_prefix_PrefixCodeRange(177,5),new encode_prefix_PrefixCodeRange(209,5),new encode_prefix_PrefixCodeRange(241,6),new encode_prefix_PrefixCodeRange(305,6),new encode_prefix_PrefixCodeRange(369,7),new encode_prefix_PrefixCodeRange(497,8),new encode_prefix_PrefixCodeRange(753,9),new encode_prefix_PrefixCodeRange(1265,10),new encode_prefix_PrefixCodeRange(2289,11),new encode_prefix_PrefixCodeRange(4337,12),new encode_prefix_PrefixCodeRange(8433,13),new encode_prefix_PrefixCodeRange(16625,24)];
encode_Static_$dict.kMaxDictionaryMatchLen = 37;
encode_Static_$dict.kInvalidMatch = 268435455;
encode_Static_$dict_$lut.kDictNumBits = 15;
encode_Static_$dict_$lut.kDictHashMul32 = 506832829;
encode_Static_$dict_$lut.kStaticDictionaryBuckets = [];
encode_Static_$dict_$lut.kStaticDictionaryWords = [];
encode_Transform.kOmitLastNTransforms = [0,12,27,23,42,63,56,48,59,64];
encode_metablock_BlockSplitter.kMaxBlockTypes = 256;
encode_metablock_ContextBlockSplitter.kMaxBlockTypes = 256;
js_Boot.__toStr = ({ }).toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;

Main.main();

export default { Brotli }
